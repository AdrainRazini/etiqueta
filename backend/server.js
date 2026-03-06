import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import appRoute from "../routes/app.js";

// corrigir __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// FRONTEND
// =======================

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

// =======================
// API
// =======================

app.use("/api", appRoute);

// =======================
// SERVER
// =======================

const PORT = process.env.PORT || 3000;

const isServerless = process.env.VERCEL || process.env.AWS_REGION;

if (!isServerless) {
  app.listen(PORT, () => {
    console.log(`[ChatBot] Backend rodando na porta ${PORT}`);
  });
} else {
  console.log("Backend pronto para Serverless");
}

export default app;