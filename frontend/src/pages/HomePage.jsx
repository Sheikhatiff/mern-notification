import React, { useState } from "react";
import EntryForm from "../components/entry/EntryForm";
import { ChevronDown } from "lucide-react";
import EntryBox from "../components/entry/EntryBox";
import { entries as entriesArray } from "../data";

function HomePage() {
  const [openForm, setOpenForm] = useState(false);
  const [entries, setEntries] = useState(entriesArray || []);

  return (
    <div className="h-full flex flex-col m-2 sm:m-4">
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
          <EntryForm setOpenForm={setOpenForm} setEntries={setEntries} />
        )}
      </div>
      <h1 className="text-stone-300 text-xl font-bold italic ml-5 pb-3 ">
        All Entries
      </h1>
      <div className="flex-1 bg-stone-900 w-full mb-4 text-white text-2xl py-4 px-2 rounded-2xl overflow-auto">
        <EntryBox entries={entries} setEntries={setEntries} />
      </div>
    </div>
  );
}

export default HomePage;
