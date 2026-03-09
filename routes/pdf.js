/* routes/pdf.js */

import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const browser = await puppeteer.launch({
      args:["--no-sandbox","--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("http://localhost:3000/relatorio", {
      waitUntil:"networkidle0"
    });

    const pdf = await page.pdf({
      format:"A4",
      printBackground:true
    });

    await browser.close();

    res.set({
      "Content-Type":"application/pdf",
      "Content-Disposition":"attachment; filename=relatorio.pdf"
    });

    res.send(pdf);

  } catch (err) {

    res.status(500).json({
      status:"error",
      message:err.message
    });

  }

});

export default router;