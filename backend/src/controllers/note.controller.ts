import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OpenAIService } from "../services/openai.service";
import { StorageService } from "../services/storage.service";

const prisma = new PrismaClient();
const ai = new OpenAIService();
const storage = new StorageService();

export async function createNote(req: Request, res: Response) {
    const { patientId } = req.body;
    const file = req.file!;
    const audioUrl = await storage.saveLocal(file);
    const transcript = await ai.transcribe(file.path);
    const { summary, ...vals } = await ai.extractOasis(transcript);

    const note = await prisma.note.create({
        data: {
            patientId,
            audioUrl,
            transcript,
            summary,
            oasisG: { create: vals }
        },
        include: { oasisG: true }
    });
    res.status(201).json(note);
}

export async function listNotes(_req: Request, res: Response) {
    const notes = await prisma.note.findMany({ include: { patient: true } });
    res.json(notes);
}

export async function getNote(req: Request, res: Response) {
    const note = await prisma.note.findUnique({
        where: { id: req.params.id },
        include: { patient: true, oasisG: true }
    });
    res.json(note);
}
