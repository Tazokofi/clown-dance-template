import { Routes, Route } from "react-router-dom";
import ClownDanceGallery from "./ClownDanceGallery";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClownDanceGallery />} />
      <Route path="/video/:id" element={<ClownDanceGallery />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
}
