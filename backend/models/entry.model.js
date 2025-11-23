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

const entrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [50, "Title must be less than 50 characters"],
      default: `new-${Date.now()}`,
    },
    text: {
      type: String,
      trim: true,
      required: [true, "text must be provided"],
    },
    emotionScores: [emotionScoreSchema],
    primaryEmotion: {
      type: String,
      default: "neutral",
    },
  },
  {
    encryptionType: "csfle",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
