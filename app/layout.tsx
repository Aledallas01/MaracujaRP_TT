"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth-provider";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, User, Shield } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

function HeaderContent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const hasAdminRole = session?.hasAdminRole || false;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700/50 backdrop-blur-lg shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-xl rounded-full"></div>
              <h1 className="relative text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                MaracujaRP
              </h1>
            </div>
            <span className="text-gray-400 text-sm font-medium hidden sm:inline-block">
              Transcript Manager
            </span>
          </div>

          {session && !isLoginPage && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 backdrop-blur-sm">
                {hasAdminRole ? (
                  <Shield className="h-5 w-5 text-orange-400" />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-300">
                  {session.user.name}
                </span>
                {hasAdminRole && (
                  <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Esci</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 min-h-screen`}
      >
        <AuthProvider>
          <HeaderContent />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-t border-gray-700/50 mt-16 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-400 text-sm">
                © 2025{" "}
                <span className="text-orange-400 font-semibold">
                  MaracujaRP Server
                </span>{" "}
                - Transcript Management System
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
