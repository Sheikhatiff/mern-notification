import React, { useState } from "react";
import EntryUI from "./EntryUI";
import ModalWindow from "../ModalWindow";

function EntryBox({ entries, setEntries }) {
  const [selected, setSelected] = useState(null);
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);

  function handleView(entryData) {
    setIsDeleteSelected(false);
    setSelected(entryData);
  }

  function handleRemove(entryData) {
    setIsDeleteSelected(true);
    setSelected(entryData);
  }

  function handleCloseModal() {
    setSelected(null);
    setIsDeleteSelected(false);
  }

  function handleSureDelete() {
    setEntries((prev) =>
      prev.filter((entry) => entry.entry !== selected.entry)
    );
    handleCloseModal();
  }

  return (
    <div>
      {entries &&
        entries.map((e, index) => (
          <EntryUI
            key={index}
            entry={e}
            handleView={() => handleView(e)}
            handleRemove={() => handleRemove(e)}
          />
        ))}

      {selected && (
        <ModalWindow
          text={selected.entry}
          date={selected.date}
          onClose={handleCloseModal}
          permission={isDeleteSelected}
          title={selected.title}
          onSure={handleSureDelete}
        />
      )}
    </div>
  );
}

export default EntryBox;
