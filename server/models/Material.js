// backend/models/Material.js
import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sizes: { type: [String], default: [] },
});

const Material = mongoose.model("Material", materialSchema);

export default Material;
