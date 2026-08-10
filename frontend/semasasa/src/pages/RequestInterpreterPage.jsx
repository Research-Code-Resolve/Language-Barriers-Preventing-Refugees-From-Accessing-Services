import { useState } from "react";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Settings,
  Headphones,
  UserPlus,
  CheckCircle,
} from "lucide-react";

export default function RequestInterpreterPage() {
  const navigate = useNavigate();
  const [refugeeName, setRefugeeName] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <img
          src="/semasasa-logo.png"
          alt="SemaSasa Logo"
          className="h-8 sm:h-10 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />

        <button
          onClick={() => navigate("/settings")}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center justify-center">
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-gray-100 shadow-sm w-full max-w-xl text-center">
          {!isSubmitted ? (
            <>
              <div className="w-16 h-16 bg-[#E2F1F8] text-[#38A8D5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Interpreter Request
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                We are connecting you with a qualified interpreter to assist
                with this conversation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                    Refugee Name (Required)
                  </label>
                  <input
                    type="text"
                    required
                    value={refugeeName}
                    onChange={(e) => setRefugeeName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 focus:outline-none focus:border-[#38A8D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                    Additional Context/Details
                  </label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide background information to help the interpreter prepare..."
                    className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 focus:outline-none focus:border-[#38A8D5] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4895D0] hover:bg-[#3b82b8] text-white py-3.5 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all pt-3.5"
                >
                  <UserPlus className="w-5 h-5" />
                  Request Interpreter
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-teal-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Request Sent</h2>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                An interpreter is reviewing your request for{" "}
                <span className="font-semibold">{refugeeName}</span> and will
                join shortly.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 bg-[#4895D0] text-white px-8 py-3 rounded-full font-medium text-sm"
              >
                Return to Translation Session
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
