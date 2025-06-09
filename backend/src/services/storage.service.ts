import fs from "fs/promises";
import path from "path";
export class StorageService {
    async saveLocal(file: Express.Multer.File) {
        const target = path.join("uploads", file.filename + path.extname(file.originalname));
        await fs.rename(file.path, target);
        return `http://localhost:3000/uploads/${path.basename(target)}`;
    }
}
