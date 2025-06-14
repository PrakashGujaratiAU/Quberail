// server/models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  purchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PurchaseStock",
    required: true,
  },
  purpose: { type: String, required: true },
  size: { type: String, required: true },
  quality: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
