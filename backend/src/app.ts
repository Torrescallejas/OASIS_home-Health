import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { router } from "./routes/routes";

dotenv.config();
const upload = multer({ dest: "uploads/" });
const app = express();

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads"));
app.use("/api", upload.single("audio"), router);

const port = 3000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
