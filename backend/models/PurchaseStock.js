// backend/models/PurchaseStock.js
import mongoose from "mongoose";

const purchaseStockSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  material: {
    type: String,
    enum: ["Pipe", "Solid Rod", "Patti", "Bolt"],
    required: true,
  },
  size: { type: String, required: true },
  quality: { type: String, enum: ["SS 304", "SS 316"], required: true },
  weight: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const PurchaseStock = mongoose.model("PurchaseStock", purchaseStockSchema);
export default PurchaseStock;
