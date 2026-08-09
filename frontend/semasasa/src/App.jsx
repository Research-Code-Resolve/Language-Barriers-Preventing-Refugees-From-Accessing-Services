import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import SelectServicePage from "./pages/ServiceSelectionPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-service" element={<SelectServicePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;