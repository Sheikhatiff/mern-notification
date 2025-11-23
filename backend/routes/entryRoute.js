import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getEntryStats,
} from "../controllers/entryController.js";

const router = express.Router();

// Statistics
router.get("/stats", getEntryStats);

// CRUD operations
router.route("/").post(createEntry).get(getAllEntries);

router.route("/:id").get(getEntry).patch(updateEntry).delete(deleteEntry);

export default router;
