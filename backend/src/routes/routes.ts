import { Router } from "express";
import { createNote, listNotes, getNote } from "../controllers/note.controller";
import { listPatients } from "../controllers/patient.controller";

export const router = Router();

router.get("/patients", listPatients);
router.post("/notes", createNote);   // ← aquí ya no hay error
router.get("/notes", listNotes);
router.get("/notes/:id", getNote);
