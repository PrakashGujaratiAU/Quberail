import express from "express";
import Quality from "../models/Quality.js";

const router = express.Router();

// GET /api/qualities
router.get("/", async (req, res) => {
  try {
    const qualities = await Quality.find();
    res.json(qualities);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/qualities
router.post("/", async (req, res) => {
  try {
    const q = await Quality.create(req.body);
    res.status(201).json(q);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
