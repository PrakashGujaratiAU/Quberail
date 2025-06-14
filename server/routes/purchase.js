// server/routes/purchase.js
import express from "express";
import PurchaseStock from "../models/PurchaseStock.js";
import Usage from "../models/Usage.js"; // if you need to reference usages

const router = express.Router();

// Create purchase
// POST /api/purchases
router.post("/", async (req, res) => {
  try {
    const p = await PurchaseStock.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List all purchases
// GET /api/purchases
router.get("/", async (req, res) => {
  try {
    const all = await PurchaseStock.find();
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Aggregate available stocks
// GET /api/purchases/available
router.get("/available", async (req, res) => {
  try {
    const purchases = await PurchaseStock.find();
    // Populate so u.purchase.material is available
    const usages = await Usage.find().populate("purchase");

    const map = {};
    // add up all purchases
    purchases.forEach((p) => {
      const key = `${p.material}|${p.size}|${p.quality}`;
      map[key] = (map[key] || 0) + p.quantity;
    });

    // subtract all usages, keyed by the same material|size|quality
    usages.forEach((u) => {
      const mat = u.purchase.material; // now defined!
      const key = `${mat}|${u.size}|${u.quality}`;
      map[key] = (map[key] || 0) - u.quantity;
    });

    // turn back into array
    const result = Object.entries(map).map(([k, v]) => {
      const [material, size, quality] = k.split("|");
      return { material, size, quality, available: v };
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
