import Note from "../models/Note.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.AI_APIKEY,
});

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title && !content) {
    return res.status(400).json({ message: "Title,Content is required!" });
  }
  try {
    const newNote = new Note({
      title,
      content,
    });
    await newNote.save();
    res.status(201).json({
      note: newNote,
      message: "New Has Been Created Successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "No id is found from the url!" });
  }
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found!" });
    }
    res.status(200).json({
      note: updatedNote,
      message: "Note Update Successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "No id is found from the url!" });
  }
  try {
    await Note.findByIdAndDelete(id);
    res.status(201).json({ message: "Delete Node Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const summrizeNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ message: "Content is required for summarization!" });
    }
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize the following text:\n\n${content}`,
        },
      ],
      model: "gpt-4o-mini",
    });
    res.status(200).json({
      summary: chatCompletion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
