import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

type OasisG = {
  m1800: number;
  m1810: number;
  m1820: number;
  m1830: number;
  m1840: number;
  m1850: number;
  m1860: number;
};

type Note = {
  id: string;
  audioUrl: string;
  transcript: string;
  summary: string;
  createdAt: string;
  oasisG: OasisG;
  patient: { firstName: string; lastName: string };
};

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Note>(`/notes/${id}`);
      setNote(data);
    })();
  }, [id]);

  if (!note) return <p className="text-center mt-10">Cargando detalle…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        &larr; Volver
      </button>

      <h1 className="text-2xl font-bold mb-2">
        Nota de {note.patient.firstName} {note.patient.lastName}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(note.createdAt).toLocaleString()}
      </p>

      {/* Audio player */}
      <audio controls src={note.audioUrl} className="mb-6 w-full" />

      {/* Resumen */}
      <h2 className="font-semibold mb-2">Resumen</h2>
      <p className="border rounded p-4 mb-6 whitespace-pre-wrap">
        {note.summary}
      </p>

      {/* Transcripción */}
      <h2 className="font-semibold mb-2">Transcripción completa</h2>
      <p className="border rounded p-4 mb-6 whitespace-pre-wrap">
        {note.transcript}
      </p>

      {/* Tabla de valores OASIS G */}
      <h2 className="font-semibold mb-2">OASIS G (M1800 – M1860)</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-1 font-medium">Campo</th>
            <th className="py-2 px-1 font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(note.oasisG).map(([k, v]) => (
            <tr key={k} className="border-b">
              <td className="py-1 px-1">{k.toUpperCase()}</td>
              <td className="py-1 px-1">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
