import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage.jsx";
import ServiceSelectionPage from "./pages/ServiceSelectionPage.jsx";
import VoiceTranslationPage from "./pages/VoiceTranslationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RequestInterpreterPage from "./pages/RequestInterpreterPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-service" element={<ServiceSelectionPage />} />
      <Route path="/voice-translation" element={<VoiceTranslationPage />} />
      <Route path="/request-interpreter" element={<RequestInterpreterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;