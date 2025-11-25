import mongoose from "mongoose";

const emotionScoreSchema = new mongoose.Schema(
  {
    label: String,
    score: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    entryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
      required: [true, "Entry ID is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    emotion: {
      type: String,
     enum: [
        "admiration", "amusement", "anger", "annoyance", "approval",
        "caring", "confusion", "curiosity", "desire", "disappointment",
        "disapproval", "disgust", "embarrassment", "excitement", "fear",
        "gratitude", "grief", "joy", "love", "nervousness", "optimism",
        "pride", "realization", "relief", "remorse", "sadness",
        "surprise", "neutral", "others"
      ],
      default: "neutral",
    },
    emotionScores: [emotionScoreSchema],
    type: {
      type: String,
      enum: ["sentiment", "milestone", "reminder"],
      default: "sentiment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
