// server/routes/usage.js
import express from "express";
import PurchaseStock from "../models/PurchaseStock.js";
import Usage from "../models/Usage.js";

const router = express.Router();

// POST /api/usages
router.post("/", async (req, res) => {
  try {
    const { purchase, date, purpose, quantity } = req.body;

    // Look up the purchase by ID
    const p = await PurchaseStock.findById(purchase);
    if (!p) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    // Create usage, carrying over size & quality from the purchase record
    const usage = await Usage.create({
      date,
      purchase,
      purpose,
      size: p.size,
      quality: p.quality,
      quantity: Number(quantity),
    });

    res.status(201).json(usage);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const usages = await Usage.find().populate("purchase"); // populate material, size, quality
    res.json(usages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
