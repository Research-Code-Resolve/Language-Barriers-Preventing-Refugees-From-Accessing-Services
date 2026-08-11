import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [language, setLanguage] = useState(
    user?.language || ""
  );

  const [message, setMessage] = useState("");

  const handleSave = (event) => {
    event.preventDefault();

    updateUser({
      name,
      language,
    });

    setMessage("Your settings have been saved.");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">

          <Link to="/dashboard">
            <img
              src="/semasasa-logo.png"
            alt="SemaSasa Logo"
            className="h-8 w-auto"
            />
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-cyan-600 font-medium"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your SemaSasa account and preferences.
        </p>

        <div className="mt-8 space-y-6">

          <section className="bg-white border rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Profile
            </h2>

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-5 text-sm">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSave}
              className="space-y-5"
            >

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Role
                </label>

                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred language
                </label>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">
                    Select language
                  </option>

                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Swahili">Swahili</option>
                  <option value="Kinyarwanda">
                    Kinyarwanda
                  </option>
                  <option value="Luganda">Luganda</option>
                  <option value="Somali">Somali</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg"
              >
                Save changes
              </button>

            </form>

          </section>

          <section className="bg-white border rounded-2xl p-6">

            <h2 className="text-xl font-semibold">
              Account
            </h2>

            <p className="text-gray-500 mt-2">
              Sign out of your SemaSasa account on this device.
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-lg"
            >
              Log out
            </button>

          </section>

        </div>

      </main>
    </div>
  );
}

export default Settings;