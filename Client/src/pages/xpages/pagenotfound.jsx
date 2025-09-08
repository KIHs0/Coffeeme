import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-6xl sm:text-8xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-700 text-sm sm:text-base">
        Redirecting to <span className="text-blue-500 underline">home</span>...
      </p>
    </div>
  );
};
