import React, { useState, useEffect } from "react";
import EntryForm from "../components/entry/EntryForm";
import { ChevronDown } from "lucide-react";
import EntryBox from "../components/entry/EntryBox";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { entryAPI, handleApiError } from "../utils/api";
import {
  useNewEntry,
  useEntryUpdated,
  useEntryDeleted,
} from "../utils/useSocket";

function HomePage() {
  const [openForm, setOpenForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await entryAPI.getAll();
      setEntries(response.data.data?.entries || []);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time socket listeners for entries
  useNewEntry((data) => {
    console.log("New entry received:", data);
    const entry = data?.data?.entry || data?.entry;
    if (entry && Array.isArray(entry) === false) {
      setEntries((prev) => {
        if (!Array.isArray(prev)) return [entry];
        return [entry, ...prev];
      });
      // Show toast notification
      setToast({
        message: `✨ New entry added with ${entry.primaryEmotion} emotion!`,
        type: "entry",
      });
    }
  });

  useEntryUpdated((data) => {
    console.log("Entry updated:", data);
    const entry = data?.data?.entry || data?.entry;
    if (entry) {
      setEntries((prev) => {
        if (!Array.isArray(prev)) return [entry];
        return prev.map((e) => (e._id === entry._id ? entry : e));
      });
    }
  });

  useEntryDeleted((data) => {
    console.log("Entry deleted:", data);
    const entryId = data?.data?.entryId || data?.entryId;
    if (entryId) {
      setEntries((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((entry) => entry._id !== entryId);
      });
    }
  });

  return (
    <div className="h-full flex flex-col m-2 sm:m-4">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}

      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <div className=" bg-stone-900 text-white text-2xl mb-4 rounded-2xl">
        {!openForm && (
          <div
            className="flex items-center justify-center gap-2 p-3  rounded-lg"
            onClick={() => setOpenForm((val) => !val)}
          >
            <small className="text-stone-300 text-sm">
              Write anything to see emotions value...
            </small>
            <button
              className="text-stone-300 hover:text-stone-100 transition-colors duration-200 p-1 rounded hover:bg-stone-600"
              aria-label="Open form"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        )}
        {openForm && (
          <EntryForm
            setOpenForm={setOpenForm}
            setEntries={setEntries}
            fetchEntries={fetchEntries}
          />
        )}
      </div>
      <h1 className="text-stone-300 text-xl font-bold italic ml-5 pb-3 ">
        All Entries
      </h1>
      <div className="flex-1 bg-stone-900 w-full mb-4 text-white text-2xl py-4 px-2 rounded-2xl overflow-auto">
        {loading ? (
          <Loader />
        ) : entries.length === 0 ? (
          <p className="text-stone-400 text-center p-8">
            No entries yet. Start writing!
          </p>
        ) : (
          <EntryBox
            entries={entries}
            setEntries={setEntries}
            fetchEntries={fetchEntries}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
