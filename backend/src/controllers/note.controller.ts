import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OpenAIService } from "../services/openai.service";
import { StorageService } from "../services/storage.service";
import fs from "fs/promises";

const prisma = new PrismaClient();
const ai = new OpenAIService();
const storage = new StorageService();

/* -------------------------------------------------------------------------- */
/*  POST /api/notes  – sube audio, transcribe, extrae OASIS y persiste         */
/* -------------------------------------------------------------------------- */
export async function createNote(
    req: Request,
    res: Response
): Promise<any> {
    const { patientId } = req.body;
    const file = req.file;

    /* 1) Validación básica ---------------------------------------------------- */
    if (!patientId || !file) {
        return res
            .status(400)
            .json({ message: "patientId y audio (file) son requeridos." });
    }

    try {
        /* 2) Guardar audio en disco -------------------------------------------- */
        const { localPath, publicUrl } = await storage.saveLocal(file);

        /* 3) Transcribir con Whisper ------------------------------------------- */
        const transcript = await ai.transcribe(localPath);
        if (!transcript.trim()) {
            // Limpieza: elimina el audio que no sirve
            await fs.unlink(localPath).catch(() => { });
            return res
                .status(500)
                .json({ message: "Transcripción vacía: Whisper no devolvió texto." });
        }

        /* 4) Extraer OASIS G con GPT ------------------------------------------- */
        const { summary, ...oasis } = await ai.extractOasis(transcript);

        /* 5) Persistir en base de datos ---------------------------------------- */
        const note = await prisma.note.create({
            data: {
                patientId,
                audioUrl: publicUrl,
                transcript,
                summary,
                oasisG: { create: oasis },
            },
            include: { oasisG: true, patient: true },
        });

        return res.status(201).json(note);
    } catch (err) {
        console.error("createNote error:", err);
        return res
            .status(500)
            .json({ message: "Error interno al procesar la nota.", detail: `${err}` });
    }
}

/* -------------------------------------------------------------------------- */
/*  GET /api/notes  – lista todas o filtra por ?patientId=                    */
/* -------------------------------------------------------------------------- */
export async function listNotes(req: Request, res: Response): Promise<any> {
    const { patientId } = req.query;

    const where = patientId ? { patientId: String(patientId) } : undefined;

    const notes = await prisma.note.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            patient: { select: { firstName: true, lastName: true } },
        },
    });

    return res.json(notes);
}

/* -------------------------------------------------------------------------- */
/*  GET /api/notes/:id  – detalle                                             */
/* -------------------------------------------------------------------------- */
export async function getNote(
    req: Request,
    res: Response
): Promise<any> {
    const note = await prisma.note.findUnique({
        where: { id: req.params.id },
        include: { patient: true, oasisG: true },
    });

    if (!note) {
        return res.status(404).json({ message: "Nota no encontrada." });
    }

    return res.json(note);
}
