import mongoose from "mongoose";

const PurposeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Purpose", PurposeSchema);
