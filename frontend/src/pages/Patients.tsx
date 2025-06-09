import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Patient[]>("/patients");
      setPatients(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando pacientes…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pacientes</h1>
      <ul className="space-y-4">
        {patients.map((p) => (
          <li key={p.id} className="border rounded-lg p-4 flex justify-between">
            <span>
              {p.firstName} {p.lastName}
            </span>
            <Link
              to={`/patient/${p.id}`}
              className="text-blue-600 hover:underline"
            >
              Ver notas &rarr;
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
