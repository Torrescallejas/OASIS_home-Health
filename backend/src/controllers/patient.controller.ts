import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** GET /api/patients */
export async function listPatients(_req: Request, res: Response) {
    const patients = await prisma.patient.findMany({
        orderBy: { lastName: "asc" },
    });
    res.json(patients);
}
