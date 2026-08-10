export default function Footer() {
  return (
    <footer className="w-full bg-[#E8ECEF] py-10 px-4 sm:px-8 mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src="/semasasa-logo.png"
            alt="SemaSasa Logo"
            className="h-8 w-auto"
          />
          <p className="text-xs sm:text-sm text-gray-600">
            © 2024 SemaSasa. Bridging communication for health and justice.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Support
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
