import express from "express";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.get("/", (_, res) => {
  res.send(
    `Server started running at http://localhost:${PORT} at ${ENVIRONMENT} mode.`
  );
});
app.get("/api/classifyEmotion", async (req, res) => {
  // const { text } = req.body;

  try {
    const client = new InferenceClient(process.env.HF_TOKEN);

    const output = await client.textClassification({
      model: "SamLowe/roberta-base-go_emotions",
      inputs: "I'm feeling excited and a bit nervous about the presentation.",
      provider: "hf-inference",
    });
    // console.log(output);
    // const text = "I'm feeling excited and a bit nervous about the presentation.";
    res.json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server started running at http://localhost:${PORT} at ${ENVIRONMENT} mode.`
  );
});
