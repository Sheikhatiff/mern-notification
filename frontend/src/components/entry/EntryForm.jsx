import { ChevronUp, Send } from "lucide-react";
import React, { useState } from "react";
import { Form } from "react-router-dom";
import { entryAPI, handleApiError } from "../../utils/api";

function EntryForm({ setOpenForm, fetchEntries }) {
  const [entry, setEntry] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!entry.trim()) {
      setError("Entry text is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const entryData = {
        title: title.trim() || `Entry ${new Date().toLocaleDateString()}`,
        text: entry.trim(),
      };

      const response = await entryAPI.create(entryData);

      if (response.data.success) {
        setEntry("");
        setTitle("");
        setOpenForm(false);
        // Fetch updated entries from backend
        if (fetchEntries) {
          await fetchEntries();
        }
      }
      setOpenForm((v) => !v);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error creating entry:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form className="p-4 flex flex-col gap-3" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-900 text-red-200 p-2 rounded text-sm">
          {error}
        </div>
      )}
      <button type="button" onClick={() => setOpenForm((val) => !val)}>
        <ChevronUp />
      </button>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full p-3 rounded-lg bg-stone-800 text-sm sm:text-xl  border-2 border-stone-800 focus:border-stone-700 focus:outline-none resize-none"
      />
      <textarea
        autoFocus
        rows="2"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="what's on your mind... ? 👀"
        required
        className="w-full p-3 rounded-lg bg-stone-800 text-sm sm:text-xl  border-2 border-stone-800 focus:border-stone-700 focus:outline-none resize-none"
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className={`hover:bg-stone-700 border-2 border-stone-700 text-xl font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full sm:w-auto flex justify-center gap-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Sending..." : "Send"} <Send />
      </button>
    </Form>
  );
}

export default EntryForm;
