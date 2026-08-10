import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Settings,
  Mic,
  Volume2,
  BriefcaseMedical,
  Scale,
  Headphones,
  PhoneOff,
  User,
  ArrowRightLeft,
} from "lucide-react";

const LANGUAGES = [
  { code: "sw", name: "Swahili", speechLang: "sw-KE" },
  { code: "ar", name: "Arabic", speechLang: "ar-SA" },
  { code: "fr", name: "French", speechLang: "fr-FR" },
  { code: "so", name: "Somali", speechLang: "so-SO" },
  { code: "es", name: "Spanish", speechLang: "es-ES" },
  { code: "am", name: "Amharic", speechLang: "am-ET" },
];

export default function VoiceTranslationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("service") || "health";

  const [refugeeLang, setRefugeeLang] = useState(LANGUAGES[0]);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [providerText, setProviderText] = useState("");
  const [translatedRefugeeText, setTranslatedRefugeeText] = useState("");
  const [refugeeText, setRefugeeText] = useState("");
  const [translatedProviderText, setTranslatedProviderText] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);

        if (activeSpeaker === "provider") {
          setProviderText(transcript);
          await translateAndSpeak(
            transcript,
            "en",
            refugeeLang.code,
            refugeeLang.speechLang,
            "refugee",
          );
        } else if (activeSpeaker === "refugee") {
          setRefugeeText(transcript);
          await translateAndSpeak(
            transcript,
            refugeeLang.code,
            "en",
            "en-US",
            "provider",
          );
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setActiveSpeaker(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [activeSpeaker, refugeeLang]);

  const startListening = (speaker) => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setActiveSpeaker(null);
      return;
    }

    setActiveSpeaker(speaker);
    recognitionRef.current.lang =
      speaker === "provider" ? "en-US" : refugeeLang.speechLang;
    setIsListening(true);
    recognitionRef.current.start();
  };

  const translateAndSpeak = async (
    text,
    sourceLang,
    targetLang,
    ttsLang,
    targetCard,
  ) => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text,
        )}&langpair=${sourceLang}|${targetLang}`,
      );
      const data = await res.json();
      const resultText = data.responseData.translatedText || text;

      if (targetCard === "refugee") {
        setTranslatedRefugeeText(resultText);
      } else {
        setTranslatedProviderText(resultText);
      }

      speakText(resultText, ttsLang);
    } catch {
      if (targetCard === "refugee") {
        setTranslatedRefugeeText(text);
      } else {
        setTranslatedProviderText(text);
      }
    }
  };

  const speakText = (text, lang) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => {
        setActiveSpeaker(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/select-service")}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <img
            src="/semasasa-logo.png"
            alt="SemaSasa Logo"
            className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-[#E6F7F4] text-[#2B8B7B] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#C6F3ED]">
          {serviceType === "health" ? (
            <>
              <BriefcaseMedical className="w-4 h-4" />
              <span>Health Mode Active</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>Legal Mode Active</span>
            </>
          )}
        </div>

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

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="text-center sm:text-left">
              <span className="text-xs text-gray-400 block font-medium">
                Service Provider
              </span>
              <span className="text-sm font-semibold text-gray-800">
                English
              </span>
            </div>

            <ArrowRightLeft className="w-4 h-4 text-gray-400 mx-2" />

            <div className="text-center sm:text-left">
              <span className="text-xs text-gray-400 block font-medium">
                Refugee
              </span>
              <select
                value={refugeeLang.code}
                onChange={(e) =>
                  setRefugeeLang(
                    LANGUAGES.find((l) => l.code === e.target.value) ||
                      LANGUAGES[0],
                  )
                }
                className="text-sm font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#2B8B7B] cursor-pointer py-0.5"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-100">
            Real-time Voice Translation Ready
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`bg-white p-6 sm:p-8 rounded-3xl border flex flex-col justify-between min-h-[380px] shadow-sm transition-all ${
            activeSpeaker === "provider" && isListening
              ? "border-[#4895D0] ring-2 ring-sky-200"
              : "border-gray-100"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <h2 className="text-lg font-bold text-gray-900">Your Voice</h2>
              </div>
              <span className="text-xs text-gray-400 font-medium">English</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="min-h-[60px]">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Original Text:
                </p>
                <p className="text-gray-800 text-sm sm:text-base font-medium">
                  {providerText || "Tap the microphone and speak..."}
                </p>
              </div>

              {translatedRefugeeText && (
                <div className="bg-[#E6F7F4]/60 p-4 rounded-2xl border border-[#C6F3ED] mt-4">
                  <p className="text-xs text-[#2B8B7B] font-semibold mb-1">
                    Translated to {refugeeLang.name}:
                  </p>
                  <p className="text-[#2B8B7B] text-sm sm:text-base font-medium">
                    {translatedRefugeeText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center pt-6">
            {activeSpeaker === "provider" && isListening && (
              <div className="flex items-center gap-1 mb-3">
                <span className="w-1.5 h-6 bg-[#4895D0] rounded-full animate-bounce" />
                <span className="w-1.5 h-8 bg-[#4895D0] rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-4 bg-[#4895D0] rounded-full animate-bounce delay-200" />
              </div>
            )}
            <button
              onClick={() => startListening("provider")}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                activeSpeaker === "provider" && isListening
                  ? "bg-red-500 scale-105 animate-pulse"
                  : "bg-[#4895D0] hover:bg-[#3b82b8]"
              }`}
            >
              <Mic className="w-7 h-7" />
            </button>
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {activeSpeaker === "provider" && isListening
                ? "Listening..."
                : "Hold / Tap to Speak"}
            </span>
          </div>
        </div>

        <div
          className={`bg-white p-6 sm:p-8 rounded-3xl border flex flex-col justify-between min-h-[380px] shadow-sm transition-all ${
            activeSpeaker === "refugee" && isListening
              ? "border-[#2B8B7B] ring-2 ring-teal-200"
              : "border-gray-100"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2B8B7B]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Refugee Voice
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {refugeeLang.name}
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="min-h-[60px]">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Original Text:
                </p>
                <p className="text-gray-800 text-sm sm:text-base font-medium">
                  {refugeeText ||
                    `Tap microphone to record ${refugeeLang.name}...`}
                </p>
              </div>

              {translatedProviderText && (
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 mt-4">
                  <p className="text-xs text-[#4895D0] font-semibold mb-1">
                    Translated to English:
                  </p>
                  <p className="text-[#4895D0] text-sm sm:text-base font-medium">
                    {translatedProviderText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center pt-6">
            {activeSpeaker === "refugee" && isListening && (
              <div className="flex items-center gap-1 mb-3">
                <span className="w-1.5 h-6 bg-[#2B8B7B] rounded-full animate-bounce" />
                <span className="w-1.5 h-8 bg-[#2B8B7B] rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-4 bg-[#2B8B7B] rounded-full animate-bounce delay-200" />
              </div>
            )}
            <button
              onClick={() => startListening("refugee")}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                activeSpeaker === "refugee" && isListening
                  ? "bg-red-500 scale-105 animate-pulse"
                  : "bg-[#2B8B7B] hover:bg-[#237366]"
              }`}
            >
              <Volume2 className="w-7 h-7" />
            </button>
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {activeSpeaker === "refugee" && isListening
                ? "Listening..."
                : `Tap to record (${refugeeLang.name})`}
            </span>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto w-full px-4 sm:px-6 pb-8 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate("/request-interpreter")}
          className="w-full sm:w-auto bg-[#3DBDA7] hover:bg-[#32A18E] text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Headphones className="w-5 h-5" />
          Request Human Interpreter
        </button>

        <button
          onClick={() => navigate("/select-service")}
          className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 border border-red-100 transition-all"
        >
          <PhoneOff className="w-5 h-5" />
          End Translation
        </button>
      </footer>
    </div>
  );
}
