// src/services/storage.service.ts
import fs from "fs/promises";
import path from "path";

export class StorageService {
    private uploadDir = path.resolve(process.cwd(), "uploads");

    async saveLocal(file: Express.Multer.File) {
        await fs.mkdir(this.uploadDir, { recursive: true });

        const ext = path.extname(file.originalname) || ".mp3";
        const target = path.join(this.uploadDir, `${file.filename}${ext}`);

        await fs.rename(file.path, target);

        return {
            localPath: target,                                       // ← para Whisper
            publicUrl: `http://localhost:3000/uploads/${path.basename(target)}` // ← para el frontend
        };
    }
}
