import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard">
            <img
              src="/semasasa-logo.png"
              alt="SemaSasa Logo"
              className="h-8 w-auto"
            />
          </Link>
          <Link
            to="/settings"
            className="text-sm font-medium text-cyan-600 hover:underline"
          >
            Settings
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 mt-2">
          Your SemaSasa service provider dashboard.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">
              Voice Translation
            </h2>
            <p className="text-gray-500 mt-2">
              Connect across language barriers using
              voice-based translation.
            </p>
            <Link
              to="/select-service"
              className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg font-medium"
            >
              Start translation
            </Link>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">
              Your profile
            </h2>
            <p className="text-gray-500 mt-2">
              Role: {user?.role}
            </p>
            <p className="text-gray-500">
              Language: {user?.language}
            </p>
            <Link
              to="/settings"
              className="inline-block mt-6 text-cyan-600 font-medium"
            >
              Manage settings →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
