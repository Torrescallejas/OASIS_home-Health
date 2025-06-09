import { BrowserRouter, Routes, Route } from "react-router-dom";
import Patients from "./pages/Patients";
import PatientNotes from "./pages/PatientNotes";
import NoteDetail from "./pages/NoteDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/patient/:id" element={<PatientNotes />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
