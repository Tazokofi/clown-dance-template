import { Routes, Route } from "react-router-dom";
import ClownDanceGallery from "./ClownDanceGallery";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClownDanceGallery />} />
      <Route path="/video/:id" element={<ClownDanceGallery />} />
    </Routes>
  );
}
