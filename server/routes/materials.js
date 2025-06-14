// backend/routes/materials.js
import express from "express";
import Material from "../models/Material.js";

const router = express.Router(); // ← use express.Router()

// GET /api/materials
router.get("/", async (req, res) => {
  try {
    const mats = await Material.find().sort("name");
    res.json(mats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/materials
router.post("/", async (req, res) => {
  try {
    const { name, sizes } = req.body;
    const mat = await Material.findOneAndUpdate(
      { name },
      { $set: { sizes } },
      { upsert: true, new: true }
    );
    res.status(201).json(mat);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
