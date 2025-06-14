import express from "express";
import Purpose from "../models/Purpose.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const purposes = await Purpose.find();
    res.json(purposes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const p = await Purpose.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
