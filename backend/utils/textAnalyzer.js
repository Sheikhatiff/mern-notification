import { HfInference } from "@huggingface/inference";

export const analyzeText = async (text) => {
  try {
    // Validate token exists
    if (!process.env.HF_TOKEN) {
      console.warn("⚠️ HF_TOKEN not found, using fallback neutral sentiment");
      return null; // Return null to trigger fallback in controller
    }

    const hf = new HfInference(process.env.HF_TOKEN);

    const output = await hf.textClassification({
      model: "SamLowe/roberta-base-go_emotions",
      inputs: text,
    });

    console.log("✅ Text analysis successful:", output);
    return output;
  } catch (error) {
    console.error("❌ Hugging Face API Error:", error.message);

    // Return null instead of throwing - let controller handle fallback
    return null;
  }
};
