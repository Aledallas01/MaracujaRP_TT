"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function UnauthorizedAccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 rounded-full border border-red-500/30">
              <ShieldAlert className="h-16 w-16 text-red-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-semibold">Accesso Negato</span>
          </div>

          <h1 className="text-3xl font-bold text-white">Non Autorizzato</h1>

          <p className="text-gray-400 leading-relaxed">
            Non hai i permessi necessari per visualizzare questo transcript.
            Solo il creatore o un amministratore possono accedere a questa
            risorsa.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            data-testid="back-home-button"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna alla Home</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="pt-8 border-t border-gray-700/50">
          <p className="text-sm text-gray-500">
            Se ritieni di dover avere accesso a questo contenuto, contatta un
            amministratore del server.
          </p>
        </div>
      </div>
    </div>
  );
}
