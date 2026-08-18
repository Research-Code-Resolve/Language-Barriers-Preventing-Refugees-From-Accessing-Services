import { Routes, Route,} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ServiceSelectionPage from "./pages/ServiceSelectionPage.jsx";
import VoiceTranslationPage from "./pages/VoiceTranslationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RequestInterpreterPage from "./pages/RequestInterpreterPage.jsx";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./ProtectedRoute";
import DocumentToolsPage from "./scanner-assistant/DocumentToolsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-service" element={<ServiceSelectionPage />} />
      <Route path="/voice-translation" element={<VoiceTranslationPage />} />
      <Route path="/request-interpreter" element={<RequestInterpreterPage />} />
      <Route path="/tools" element={<DocumentToolsPage />} />
      <Route

        path="/login"

        element={<Login />}

      />

      <Route

        path="/signup"

        element={<SignUp />}

      />

      {/* Protected pages */}

      <Route

        path="/dashboard"

        element={

          <ProtectedRoute>

            <Dashboard />

          </ProtectedRoute>

        }

      />

      <Route

        path="/settings"

        element={

          <ProtectedRoute>

            <Settings />

          </ProtectedRoute>

        }

      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default App;