import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Settings,
  BriefcaseMedical,
  Scale,
  User,
  Check,
} from "lucide-react";

export default function ServiceSelectionPage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const handleSelect = (serviceType) => {
    setSelectedService(serviceType);
    setTimeout(() => {
      navigate(`/voice-translation?service=${serviceType}`);
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#DCF5F2]/40">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate("/")}
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs sm:text-sm border border-sky-200">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3">
          How can we help today?
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mb-10 sm:mb-14">
          Select a service context to connect with a specialized interpreter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
          <div
            onClick={() => handleSelect("health")}
            className={`bg-white p-8 sm:p-10 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
              selectedService === "health"
                ? "border-[#2B8B7B] ring-2 ring-[#2B8B7B] shadow-lg scale-[1.02]"
                : "border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200"
            }`}
          >
            {selectedService === "health" && (
              <div className="absolute top-4 right-4 bg-[#2B8B7B] text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="w-20 h-20 bg-[#C6F3ED] rounded-full flex items-center justify-center mb-6">
              <BriefcaseMedical className="w-10 h-10 text-[#2B8B7B]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Health Services
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Medical consultations, pharmacy visits, clinical assessments, and
              hospital appointments.
            </p>
          </div>

          <div
            onClick={() => handleSelect("legal")}
            className={`bg-white p-8 sm:p-10 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
              selectedService === "legal"
                ? "border-[#2B8B7B] ring-2 ring-[#2B8B7B] shadow-lg scale-[1.02]"
                : "border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200"
            }`}
          >
            {selectedService === "legal" && (
              <div className="absolute top-4 right-4 bg-[#2B8B7B] text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="w-20 h-20 bg-[#C6F3ED] rounded-full flex items-center justify-center mb-6">
              <Scale className="w-10 h-10 text-[#2B8B7B]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Legal Services
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Immigration appointments, legal consultations, court hearings, and
              document translation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
