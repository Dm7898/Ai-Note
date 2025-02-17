import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoCopyOutline, IoCopy } from "react-icons/io5";
import { useState } from "react";
import { toast } from "react-toastify";

const Note = ({ note, handleDelete, handleUpdate }) => {
  const [copyId, setCopyId] = useState(null);
  const copyToClipboard = (id, title, content) => {
    const textToCopy = `${title}\n${content}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyId(id);
        toast.success("Copied!");
        setTimeout(() => setCopyId(null), 2000);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="bg-[#ecfdc7] relative flex flex-col gap-2.5 md:gap-3 lg:gap-4 text-black rounded-2xl p-6 w-full  md:w-[48%] lg:w-[24%] shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold text-black capitalize">
        {note.title}
      </h2>
      <p className="text-gray-600 text-base leading-relaxed flex-grow">
        {note.content}
      </p>
      <div className="flex gap-2 mt-auto">
        <button
          className="flex items-center justify-center bg-[#315be4] hover:bg-[#315be4e3] text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => copyToClipboard(note._id, note.title, note.content)}
        >
          {copyId ? (
            <IoCopyOutline className="text-xl" />
          ) : (
            <IoCopy className="text-xl" />
          )}
        </button>
        <button
          className="flex items-center justify-center bg-[#31dee4] hover:bg-[#7deae4] text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => handleUpdate(note)}
        >
          <MdOutlineEdit className="text-xl" />
        </button>
        <button
          className="flex items-center justify-center bg-[#f14a68] hover:bg-[#ff5482] text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => handleDelete(note._id)}
        >
          <MdDeleteOutline className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Note;
