import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.get("/", (_, res) => {
  res.send(
    `Server started running at http://localhost:${PORT} at ${ENVIRONMENT} mode.`
  );
});
app.listen(PORT, () => {
  console.log(
    `Server started running at http://localhost:${PORT} at ${ENVIRONMENT} mode.`
  );
});
