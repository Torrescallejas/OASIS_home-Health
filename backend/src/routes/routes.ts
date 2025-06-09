import { Router } from "express";
import { listPatients } from "../controllers/patient.controller";
import { createNote, listNotes, getNote } from "../controllers/note.controller";

export const router = Router();

router.get("/patients", listPatients);
router.post("/notes", createNote);
router.get("/notes", listNotes);
router.get("/notes/:id", getNote);
