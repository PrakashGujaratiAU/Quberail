import mongoose from "mongoose";

const QualitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Quality", QualitySchema);
