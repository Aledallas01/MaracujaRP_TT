"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth-provider";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

function HeaderContent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-400">MaracujaRP</h1>
            <span className="ml-3 text-gray-400">Transcript Manager</span>
          </div>

          {session && !isLoginPage && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium">{session.user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Esci</span>
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
        className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}
      >
        <AuthProvider>
          <HeaderContent />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-gray-800 border-t border-gray-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-400">
                © 2025 MaracujaRP Server - Transcript Management System
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
