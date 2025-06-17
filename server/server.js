import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import materialRoutes from "./routes/materials.js";
import purchaseRoutes from "./routes/purchase.js";
import purposeRoutes from "./routes/purpose.js";
import qualityRoutes from "./routes/quality.js";
import usageRoutes from "./routes/usage.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://prakashgujarati:CEg2utxS6kuxRNYH@cluster0.8cjw3hn.mongodb.net/ravilakhani"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err)); // More descriptive error

// Your API routes
app.use("/api/materials", materialRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/usages", usageRoutes);
app.use("/api/qualities", qualityRoutes);
app.use("/api/purposes", purposeRoutes);

// IMPORTANT: Export the app instance for Vercel
export default app;
