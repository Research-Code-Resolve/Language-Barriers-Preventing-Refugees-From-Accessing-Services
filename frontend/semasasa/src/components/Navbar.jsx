import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/semasasa-logo.png"
                alt="SemaSasa Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              How It Works
            </a>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#4895D0] hover:bg-[#3b82b8] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block text-gray-600 hover:text-gray-900 text-base font-medium py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block text-gray-600 hover:text-gray-900 text-base font-medium py-1"
          >
            How It Works
          </a>
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/signup");
            }}
            className="w-full bg-[#4895D0] text-white py-3 rounded-full font-medium text-center shadow-sm"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
