import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

type Note = {
  id: string;
  createdAt: string;
  audioUrl: string;
  patientId: string;
};

export default function PatientNotes() {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Cargar notas (y filtrar por paciente)
  useEffect(() => {
    (async () => {
      const { data } = await api.get<Note[]>("/notes");
      setNotes(data.filter((n) => n.patientId === patientId));
    })();
  }, [patientId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("patientId", patientId!);
    form.append("audio", file);

    const { data } = await api.post("/notes", form);
    setNotes((prev) => [data, ...prev]);
    setUploading(false);
    setFile(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        &larr; Volver a pacientes
      </button>

      {/* Formulario de carga */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-4 mb-6 flex flex-col gap-4"
      >
        <h2 className="font-semibold">Subir nota de audio</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="file:mr-4 file:py-1 file:px-3 file:border file:rounded"
        />
        <button
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Subiendo…" : "Subir"}
        </button>
      </form>

      {/* Lista de notas */}
      <h2 className="text-xl font-bold mb-4">Notas del paciente</h2>
      {notes.length === 0 ? (
        <p>No hay notas aún.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((n) => (
            <li
              key={n.id}
              className="border rounded-lg p-4 flex justify-between"
            >
              <span>{new Date(n.createdAt).toLocaleString()}</span>
              <Link
                to={`/notes/${n.id}`}
                className="text-blue-600 hover:underline"
              >
                Detalle &rarr;
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
