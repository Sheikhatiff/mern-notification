import { ChevronUp, Send } from "lucide-react";
import React, { useState } from "react";
import { Form } from "react-router-dom";

function EntryForm({ setOpenForm, setEntries }) {
  const [entry, setEntry] = useState("");
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataObject = Object.fromEntries(formData.entries());
    console.log("Form Data Object:", dataObject);
    if (!dataObject.title) dataObject.title = "new-" + Date.now();
    setEntries((val) => [dataObject, ...val]);
    setEntry("");
    setOpenForm((val) => !val);
  }

  return (
    <Form
      method="POST"
      className="p-4 flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      {/* <label htmlFor="entry" className=" font-medium text-xl">
        Write:
      </label> */}
      <button type="button" onClick={() => setOpenForm((val) => !val)}>
        <ChevronUp />
      </button>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 rounded-lg bg-stone-800 text-sm sm:text-xl  border-2 border-stone-800 focus:border-stone-700 focus:outline-none resize-none"
      />
      <textarea
        name="entry"
        autoFocus
        rows="2"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="what's on your mind... ? 👀"
        required
        className="w-full p-3 rounded-lg bg-stone-800 text-sm sm:text-xl  border-2 border-stone-800 focus:border-stone-700 focus:outline-none resize-none"
      ></textarea>
      <input type="hidden" name="id" value={new Date()} />
      <button
        type="submit"
        // disabled={entry === ""}
        className=" hover:bg-stone-700 border-2 border-stone-700 text-xl font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full sm:w-auto flex justify-center gap-2"
      >
        Send <Send />
      </button>
    </Form>
  );
}

export default EntryForm;
