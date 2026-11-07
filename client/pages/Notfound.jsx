// NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* 404 number */}
      <p className="text-[10rem] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 select-none">
        404
      </p>

      {/* Message */}
      <h1 className="text-2xl md:text-3xl font-semibold mt-4">
        Page Not Found
      </h1>
      <p className="text-gray-400 mt-2 max-w-md text-center">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      {/* CTA */}
      <Link
        to="/login"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Login/Sign Up
      </Link>
    </div>
  );
}
