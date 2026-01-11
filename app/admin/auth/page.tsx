"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminAuth() {
  const [code, setCode] = useState("");
  const [error, setError] =
    useState("");
  const router = useRouter();

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Default admin code - you can change this or make it environment variable
    const adminCode =
      process.env
        .NEXT_PUBLIC_ADMIN_CODE ||
      "scroti2024";

    if (code === adminCode) {
      // Store authentication in sessionStorage
      if (
        typeof window !== "undefined"
      ) {
        sessionStorage.setItem(
          "admin_authenticated",
          "true"
        );
        sessionStorage.setItem(
          "admin_code",
          code
        );
      }
      router.push("/admin");
    } else {
      setError(
        "Invalid code. Please try again."
      );
      setCode("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Access
          </h1>
          <p className="text-gray-400">
            Enter your admin code to
            access the customization
            panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Admin Code
            </label>
            <input
              id="code"
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Enter admin code"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            style={{
              backgroundColor:
                "#065f46",
            }}
          >
            Access Admin Panel
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Default code: scroti2024
          </p>
        </div>
      </div>
    </div>
  );
}
