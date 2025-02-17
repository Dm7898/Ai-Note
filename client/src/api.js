import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/note",
  headers: { "Content-Type": "application/json" },
});

export const getAllNotes = async () => await api.get("/");
export const createNote = async (note) => await api.post("/", note);
export const updateNote = async (id, note) => await api.put(`/${id}`, note);
export const deleteNote = async (id) => await api.delete(`/${id}`);
export const summraize = async (content) =>
  await api.post("/summrize", { content });
