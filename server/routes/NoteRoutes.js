import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
  summrizeNote,
} from "../controllers/NoteController.js";

const router = express.Router();

router
  .get("/", getAllNotes)
  .post("/", createNote)
  .put("/:id", updateNote)
  .delete("/:id", deleteNote)
  .post("/summrize", summrizeNote);
export default router;
