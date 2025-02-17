import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import noteRoutes from "./routes/NoteRoutes.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoose connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Hello server");
});

app.use("/api/note", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port http://localhost:${PORT}`);
});
