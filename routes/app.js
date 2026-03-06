/* routes/app.js */
// Aplicativo Virtual http

import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {

  res.json({
    status: "ok",
    message: "Rota funcionando"
  });

});

export default router;