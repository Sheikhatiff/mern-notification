import { InferenceClient } from "@huggingface/inference";
export const analyzeText = async (text) => {
  try {
    const client = new InferenceClient(process.env.HF_TOKEN);
    const output = await client.textClassification({
      model: "SamLowe/roberta-base-go_emotions",
      inputs: text,
      provider: "hf-inference",
    });
    return output;
  } catch (error) {
    throw error;
  }
};
