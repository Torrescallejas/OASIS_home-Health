import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { format } from "date-fns";          // 👉 nice DOB formatting (optional)

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;            // ISO string
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<Patient[]>("/patients");
      setPatients(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="text-center mt-16 text-lg">Loading patients…</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Patients</h1>

      {/* responsive grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <Link
            key={p.id}
            to={`/patient/${p.id}`}
            className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition
                       hover:shadow-lg hover:border-blue-500 focus:outline-none focus:ring
                       flex items-center gap-4 p-5"
          >
            {/* avatar with initials */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/90 text-white text-xl font-semibold shadow-inner">
              {p.firstName[0]}
              {p.lastName[0]}
            </div>

            {/* patient info */}
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                {p.firstName} {p.lastName}
              </p>
              <p className="text-sm text-gray-500">
                DOB:&nbsp;
                {format(new Date(p.dob), "MMMM d, yyyy")}
              </p>
            </div>

            {/* chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
