function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/semassasje-logo.jpeg"
            alt="SemaSasa"
            className="w-48 mx-auto"
          />
        </div>

        {children}

        <p className="text-center text-sm text-gray-500 mt-8">
          SemaSasa • Breaking language barriers
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;