import React, { useState } from "react";
import EntryUI from "./EntryUI";
import ModalWindow from "../ModalWindow";
import { entryAPI, handleApiError } from "../../utils/api";

function EntryBox({ entries, fetchEntries }) {
  const [selected, setSelected] = useState(null);
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleSureDelete() {
    if (!selected?._id) {
      console.error("No entry ID found");
      return;
    }

    try {
      setDeleting(true);
      const response = await entryAPI.delete(selected._id);

      if (response.data.success) {
        // Refresh entries from backend
        if (fetchEntries) {
          await fetchEntries();
        }
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      console.error("Error deleting entry:", errorMsg);
    } finally {
      handleCloseModal();
      setDeleting(false);
    }
  }

  return (
    <div>
      {entries &&
        entries?.map((e, index) => (
          <EntryUI
            key={e._id || index}
            entry={e}
            handleView={() => handleView(e)}
            handleRemove={() => handleRemove(e)}
          />
        ))}

      {selected && (
        <ModalWindow
          text={selected.text}
          date={selected.createdAt}
          onClose={handleCloseModal}
          permission={isDeleteSelected}
          title={selected.title}
          onSure={handleSureDelete}
          isDeleting={deleting}
        />
      )}
    </div>
  );
}

export default EntryBox;
