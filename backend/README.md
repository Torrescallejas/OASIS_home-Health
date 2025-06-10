# AI Scribe for Home‑Health OASIS Assessments

> **1‑click demo:** `git clone … && cp .env.example .env && docker compose up --build`

---

## ✨ What it does

* **Record → Transcribe → Code** ‑ Upload a home‑health visit audio note, the system transcribes it with Whisper and auto‑codes Section G (M1800‑M1860) using GPT function‑calling.
* **Persists** patients, notes, transcripts, summaries & OASIS‑G in Postgres.
* **Plays back** audio, shows the full transcript, a clinical summary and the OASIS table—ready to copy into OASIS‑E.
* **Runs anywhere** via Docker Compose (Postgres 16, Node 18, Nginx) or bare‑metal.

---

## 🖼️ Screenshots

| Patients                           | Upload audio                   | Note detail                    |
| :--------------------------------- | :----------------------------- | :----------------------------- |
| ![Patients](docs/img/patients.png) | ![Upload](docs/img/upload.png) | ![Detail](docs/img/detail.png) |

---

## 🏗️ Stack

| Layer        | Tech                                         |
| ------------ | -------------------------------------------- |
| **Frontend** | React 18 + Vite 5 + Tailwind 3               |
| **Backend**  | Node 18 + TypeScript 5 + Express             |
| **AI**       | OpenAI Whisper‑1 · GPT‑4o (function‑calling) |
| **DB**       | Postgres 16, Prisma ORM                      |
| **Infra**    | Docker Compose (& hot‑reload volumes)        |

---

## ⚡ Quick start (Docker)

```bash
# 1. Clone & enter
$ git clone https://github.com/<you>/ai-scribe-oasis.git
$ cd ai-scribe-oasis

# 2. Add your OpenAI API key
$ cp .env.example .env                     # then edit .env

# 3. Launch everything
$ docker compose up --build                # first time ⇒ ~3 min

# 4. Seed demo patients (optional)
$ docker compose exec backend npm run seed

# 5. Open the app
🌐  http://localhost:5173
```

> Need hot‑reload? Run `npm run dev` separately in **frontend/** and **backend/** (without Docker).

---

## 🔑 Environment variables

| Name             | Purpose                       |
| ---------------- | ----------------------------- |
| `OPENAI_API_KEY` | Your OpenAI secret key        |
| `DATABASE_URL`   |  (Injected by docker‑compose) |

See **`.env.example`** for defaults.

---

## 📂 Project structure (monorepo)

```
ai-scribe/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/    # patient & note endpoints
│  │  ├─ services/       # openai + storage
│  │  ├─ app.ts
│  │  └─ routes.ts
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  └─ Dockerfile
├─ frontend/
│  ├─ src/pages/         # Patients, PatientNotes, NoteDetail
│  ├─ src/services/      # Axios wrapper
│  └─ Dockerfile
├─ docker-compose.yml
└─ README.md
```

---

## 🗄️ Database

### Schema (Prisma)

```prisma
model Patient { id String @id @default(uuid()) … }
model Note    { id String @id @default(uuid()) … }
model OasisG  { id String @id @default(uuid()) … }
```

Run migrations:

```bash
$ docker compose exec backend npx prisma migrate deploy
```

---

## 🔌 REST API

| Method | URL              | Body / Params                  | Description                  |
| ------ | ---------------- | ------------------------------ | ---------------------------- |
| `GET`  | `/api/patients`  | –                              | List patients                |
| `POST` | `/api/notes`     |  `multipart: patientId, audio` | Upload & process note        |
| `GET`  | `/api/notes`     |  `?patientId=`                 | List notes (optional filter) |
| `GET`  | `/api/notes/:id` | –                              | Note detail                  |

---

## 🧑‍💻 NPM scripts

| Location | Command                     | What it does                |
| -------- | --------------------------- | --------------------------- |
| root     | `docker compose up --build` | Build + run all services    |
| backend  | `npm run dev`               | ts‑node‑dev with hot‑reload |
| backend  | `npm run seed`              | Seed demo patients          |
| frontend | `npm run dev`               | Vite dev server             |

---

## 🩺 Troubleshooting

| Symptom                         | Fix                                                          |
| ------------------------------- | ------------------------------------------------------------ |
| `ENOENT uploads/…`              | `uploads/` ignored in watch & auto‑mkdir in `StorageService` |
| `400 expected string, got null` | Check OpenAI key & Whisper transcribed empty; see logs.      |
| DB refuses connections          | Postgres may take \~3 s to accept; backend retries 5×.       |

---

## 🛣️ Roadmap / Next steps

* 🔐 Add JWT auth & RBAC (clinicians vs admins)
* ☁️ S3 storage (switch StorageService via ENV)
* 🧪 Unit tests (Jest + Supertest) & GitHub Actions CI
* 📝 Type‑safe front (tRPC or React Query)
* 📈 Analytics dashboard (OASIS score trends)

---

## 📄 License

MIT © 2025 Carlos Torres
