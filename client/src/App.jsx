import { useCallback, useEffect, useRef, useState } from "react";
import Note from "./Note";
import {
  getAllNotes,
  createNote,
  summraize,
  deleteNote,
  updateNote,
} from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { debounce } from "lodash";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({ title: "", content: "" });
  const [isSummriazed, setIsSummriazed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const noteRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getAllNotes();
      setNotes(data);
      console.log(data);
    } catch (err) {
      console.error(err);
      toast.error("failed to fecth data");
    }
  };

  const saveNote = async () => {
    if (!note.title || !note.content) {
      toast.warning("Title,Content are empty");
      return;
    }
    try {
      let updatedNotes;
      if (editingId) {
        if (
          noteRef.current?.title === note.title &&
          noteRef.current?.content === note.content
        )
          return toast.info("Nothing has changed");
        await updateNote(editingId, note);
        updatedNotes = notes.map((n) =>
          n._id === editingId ? { ...n, ...note } : n
        );
        toast.success("Note Updated!");
        setEditingId(null);
      } else {
        const { data } = await createNote(note);
        updatedNotes = [...notes, data.note];
        console.log(updatedNotes);
        toast.success("Note has been created");
      }
      setIsSummriazed(false);
      setNotes(updatedNotes);
      setNote({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (!id) return toast.warning("no id found");
      try {
        await deleteNote(id);
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note Deleted");
      } catch (err) {
        console.error(err);
        toast.error("Error While Deleting");
      }
    },
    [notes]
  );

  const handleUpdate = useCallback(async (note) => {
    setNote({ title: note.title, content: note.content });
    noteRef.current = { title: note.title, content: note.content };
    setEditingId(note._id);
  }, []);

  const summrizeText = async () => {
    if (isSummriazed) return toast.warning("content has already summrized!");
    if (!note.content) return toast.warning("no content");
    if (loading) return;
    try {
      setLoading(true);
      setNote((prev) => ({ ...prev, content: "🔍Genrating Content..." }));
      const response = await summraize(note.content);
      setNote((prev) => ({ ...prev, content: response.data.summary }));
      setIsSummriazed(true);
    } catch (err) {
      console.error(err);
      setNote((prev) => ({
        ...prev,
        content: "There is an error while genrating🙁",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto p-3">
      <ToastContainer position="top-center" autoClose={1000} />
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center">
        NoteAI
      </h2>
      <div className="flex flex-col gap-2.5 mb-4">
        <label htmlFor="title" className="text-[#ecfdc7]">
          Title
        </label>
        <input
          name="title"
          type="text"
          value={note.title}
          placeholder="Enter Title"
          className="border-2 border-[#f44a00] focus:border-[#f44900e8] outline-none rounded-xl px-3 py-3 transition-all duration-300 ease-in-out"
          onChange={(e) =>
            setNote({ ...note, [e.target.name]: e.target.value })
          }
        ></input>
        <label htmlFor="content" className="text-[#ecfdc7]">
          Content
        </label>
        <textarea
          name="content"
          placeholder="Enter Content"
          value={note.content}
          rows={4}
          className="border-2 border-[#f44a00] focus:border-[#f44900f0]  outline-none rounded-xl px-3 py-3 transition-all duration-300 ease-in-out"
          onChange={(e) =>
            setNote({ ...note, [e.target.name]: e.target.value })
          }
        ></textarea>

        <div className="flex gap-2 mt-1">
          <button
            className="bg-[#f44a00] hover:bg-[#f44900df] px-2 py-1 rounded cursor-pointer transition-all duration-500 ease-in-out"
            onClick={saveNote}
          >
            {editingId ? "Update Note" : "Save Note"}
          </button>
          <button
            className="bg-[#f44a00] hover:bg-[#f44900ef] px-4 py-1.5 rounded cursor-pointer transition-all duration-500 ease-in-out"
            onClick={summrizeText}
            disabled={loading}
          >
            Summrize
          </button>
        </div>
      </div>
      {notes.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {notes.map((note, index) => (
            <Note
              key={index}
              note={note}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
