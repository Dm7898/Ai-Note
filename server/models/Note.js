import mongoose, { model } from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Note = mongoose.model("note", NoteSchema);
export default Note;
