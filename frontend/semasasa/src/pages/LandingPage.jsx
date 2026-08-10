import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mic,
  Globe,
  Headphones,
  FileText,
  ArrowRight,
  BriefcaseMedical,
  Volume2,
  RefreshCw,
  User,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Bridging the Language Gap in{" "}
              <span className="text-[#38A8D5]">Health</span> and{" "}
              <span className="text-[#3DBDA7]">Justice.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              Real-time, voice-to-voice translation built for critical
              conversations where clarity matters most. Designed for frontline
              service providers communicating with refugees. Clear, immediate,
              and culturally sensitive.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#4895D0] hover:bg-[#3b82b8] text-white px-7 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Mic className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="border-2 border-[#4895D0] text-[#4895D0] hover:bg-sky-50 px-7 py-3.5 rounded-full font-medium flex items-center justify-center transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="bg-[#DCF3F0]/60 p-6 sm:p-8 rounded-3xl border border-[#C5EDE6] shadow-sm relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <BriefcaseMedical className="w-4 h-4 text-sky-600" />
                </div>
                <span>Provider</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-600">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <RefreshCw className="w-3.5 h-3.5" />
                <Volume2 className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <span>Refugee</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-800 text-sm sm:text-base font-medium">
                  "How can I help you today?"
                </p>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-teal-800 text-sm sm:text-base font-medium">
                  "Je, ninawezaje kukusaidia leo?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-sky-100 text-[#4895D0] rounded-full flex items-center justify-center mb-4">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Speak
              </h3>
              <p className="text-sm text-gray-600">
                Speak naturally in your native language into your device.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-teal-100 text-[#3DBDA7] rounded-full flex items-center justify-center mb-4">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Translate
              </h3>
              <p className="text-sm text-gray-600">
                Our system processes and translates with contextual accuracy in
                real-time.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-sky-100 text-[#4895D0] rounded-full flex items-center justify-center mb-4">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hear</h3>
              <p className="text-sm text-gray-600">
                The listener hears the translation spoken in a natural voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Empowering Clear Communication
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Designed specifically for the nuances of health and legal
              services, ensuring accuracy and trust in every conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 text-[#4895D0] rounded-2xl flex items-center justify-center mb-6">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-Time Voice Translation
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Speak naturally. SemaSasa translates your voice instantly,
                preserving tone and intent, allowing for a seamless
                conversational flow without the density of typical translation
                apps.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 text-[#4895D0] rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Diverse Languages
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Support for critical languages and dialects needed in frontline
                refugee services.
              </p>
            </div>

            <div className="bg-[#B9EBE1] p-6 sm:p-8 rounded-3xl border border-[#A2E2D6] shadow-sm">
              <div className="w-12 h-12 bg-white/80 text-[#2B8B7B] rounded-2xl flex items-center justify-center mb-6">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Human Interpreter Escalate
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                For complex medical or legal situations, seamlessly escalate to
                a live human interpreter with full conversation context.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-sky-100 text-[#4895D0] rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Conversation Summaries
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automatically generate secure, HIPAA-compliant summaries of your
                translation sessions for case notes and records.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
