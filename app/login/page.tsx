"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const error = searchParams.get("error");

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("discord", { callbackUrl: "/" });
    } catch (error) {
      console.error("Errore durante il login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-orange-400 mb-2">
            MaracujaRP
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">
            Transcript Manager
          </h2>
          <p className="text-gray-400">
            Accedi con Discord per visualizzare i transcript
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            <p className="text-sm">
              {error === "OAuthCallback"
                ? "Errore durante l'autenticazione con Discord. Riprova."
                : "Si è verificato un errore. Riprova più tardi."}
            </p>
          </div>
        )}

        <div className="bg-gray-800/70 rounded-xl p-8 border border-gray-700/60 shadow-lg backdrop-blur-sm">
          <button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            data-testid="discord-login-button"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Accesso in corso...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Accedi con Discord</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Effettuando il login accetti i termini di utilizzo</p>
            <p className="mt-2">del sistema MaracujaRP Transcript Manager</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>L'accesso è limitato ai membri autorizzati del server Discord</p>
        </div>
      </div>
    </div>
  );
}
