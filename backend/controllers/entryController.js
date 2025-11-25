import Entry from "../models/entry.model.js";
import Notification from "../models/notification.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { analyzeText } from "../utils/textAnalyzer.js";
import {
  emitNewEntry,
  emitEntryUpdated,
  emitEntryDeleted,
  emitStatsUpdate,
} from "../utils/socketHandler.js";

// Helper function to process emotions (get top 5 + others)
const processEmotions = (emotionArray) => {
  if (!emotionArray || emotionArray.length === 0) {
    return {
      primaryEmotion: "neutral",
      emotionScores: [{ label: "neutral", score: 1 }],
    };
  }

  const sorted = emotionArray.sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);
  const sumTop5 = top5.reduce((sum, item) => sum + item.score, 0);
  const others = Math.max(0, 1 - sumTop5);

  const emotionScores = [...top5, { label: "others", score: others }];

  return {
    primaryEmotion: top5[0].label.toLowerCase(),
    emotionScores,
  };
};

// Create a new entry and analyze sentiment
export const createEntry = catchAsync(async (req, res, next) => {
  console.log("📝 Creating entry - Request body:", req.body);

  const { title, text } = req.body;

  if (!text || text.trim().length === 0) {
    return next(new AppError("Entry text is required", 400));
  }

  let primaryEmotion = "neutral";
  let emotionScores = [{ label: "neutral", score: 1 }];

  console.log("🔍 Analyzing text...");
  const analysisResult = await analyzeText(text).catch((error) => {
    console.error("❌ Text analysis failed:", error.message);
    return null;
  });

  if (analysisResult) {
    console.log("✅ Analysis result:", analysisResult);
    const processed = processEmotions(analysisResult);
    primaryEmotion = processed.primaryEmotion;
    emotionScores = processed.emotionScores;
  } else {
    console.warn("⚠️ Using fallback neutral sentiment");
  }

  console.log("💾 Creating entry in database...");
  const entry = await Entry.create({
    title: title || `new-${Date.now()}`,
    text,
    primaryEmotion,
    emotionScores,
  });
  console.log("✅ Entry created:", entry._id);

  console.log("🔔 Creating notification...");
  const notification = await Notification.create({
    entryId: entry._id,
    title: entry.title,
    message: `New entry created with ${primaryEmotion} sentiment`,
    emotion: primaryEmotion,
    emotionScores,
    type: "sentiment",
  });
  console.log("✅ Notification created:", notification._id);

  // Emit real-time notification
  if (global.io) {
    console.log("📡 Emitting socket event...");
    emitNewEntry(global.io, entry, notification);
  }

  res.status(201).json({
    status: "success",
    data: {
      entry,
      notification,
    },
  });
});

// Get all entries
export const getAllEntries = catchAsync(async (req, res, next) => {
  const entries = await Entry.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: entries.length,
    data: {
      entries,
    },
  });
});

// Get single entry by ID
export const getEntry = catchAsync(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);

  if (!entry) {
    return next(new AppError("No entry found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { entry },
  });
});

// Update entry
export const updateEntry = catchAsync(async (req, res, next) => {
  const { title, text } = req.body;

  const entry = await Entry.findById(req.params.id);

  if (!entry) {
    return next(new AppError("No entry found with that ID", 404));
  }

  // Re-analyze sentiment if text was updated
  if (text) {
    let primaryEmotion = "neutral";
    let emotionScores = [{ label: "neutral", score: 1 }];

    const analysisResult = await analyzeText(text).catch((error) => {
      console.error("Text analysis failed:", error.message);
      return null;
    });

    if (analysisResult) {
      const processed = processEmotions(analysisResult);
      primaryEmotion = processed.primaryEmotion;
      emotionScores = processed.emotionScores;
    }

    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      { title: title || entry.title, text, primaryEmotion, emotionScores },
      { new: true, runValidators: true }
    );

    // Create a new notification for the update
    const notification = await Notification.create({
      entryId: updatedEntry._id,
      title: updatedEntry.title,
      message: `Entry updated with ${primaryEmotion} sentiment`,
      emotion: primaryEmotion,
      emotionScores,
      type: "sentiment",
    });

    // Emit real-time update to all connected clients
    if (global.io) {
      emitEntryUpdated(global.io, updatedEntry, notification);
    }

    res.status(200).json({
      status: "success",
      data: {
        entry: updatedEntry,
        notification,
      },
    });
  } else {
    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      { title: title || entry.title },
      { new: true, runValidators: true }
    );

    // Emit real-time update to all connected clients
    if (global.io) {
      emitEntryUpdated(global.io, updatedEntry, null);
    }

    res.status(200).json({
      status: "success",
      data: { entry: updatedEntry },
    });
  }
});

// Delete entry
export const deleteEntry = catchAsync(async (req, res, next) => {
  const entry = await Entry.findByIdAndDelete(req.params.id);

  if (!entry) {
    return next(new AppError("No entry found with that ID", 404));
  }

  // Delete associated notifications
  await Notification.deleteMany({ entryId: entry._id });

  // Emit real-time deletion to all connected clients
  if (global.io) {
    emitEntryDeleted(global.io, entry._id);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get entry statistics
export const getEntryStats = catchAsync(async (req, res, next) => {
  const stats = await Entry.aggregate([
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        avgLength: { $avg: { $strLenCP: "$text" } },
      },
    },
  ]);

  // Get emotion distribution
  const emotionStats = await Entry.aggregate([
    {
      $group: {
        _id: "$primaryEmotion",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const statsData = {
    entries: stats[0] || { totalEntries: 0, avgLength: 0 },
    emotions: emotionStats,
  };

  // Emit stats update to all connected clients
  if (global.io) {
    emitStatsUpdate(global.io, statsData);
  }

  res.status(200).json({
    status: "success",
    data: statsData,
  });
});
