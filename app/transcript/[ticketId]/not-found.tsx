import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Icona di errore */}
        <div className="mx-auto h-20 w-20 bg-red-900/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-red-900/40">
          <AlertCircle className="h-10 w-10 text-red-400 animate-pulse" />
        </div>

        {/* Testo principale */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Transcript Non Trovato
          </h1>
          <p className="text-gray-400 text-base">
            Il transcript con l'ID specificato non esiste o non è ancora
            disponibile nel sistema.
          </p>
        </div>

        {/* Box con possibili cause */}
        <div className="bg-gray-800/70 rounded-xl border border-gray-700/60 p-6 space-y-4 shadow-inner">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            Possibili cause:
          </h2>
          <ul className="text-left text-sm text-gray-300 space-y-2 leading-relaxed">
            <li>• L'ID del ticket è stato inserito in modo errato</li>
            <li>• Il transcript non è ancora stato caricato nel sistema</li>
            <li>• Il ticket è stato eliminato o archiviato</li>
          </ul>
        </div>

        {/* Pulsante di ritorno */}
        <Link
          href="/"
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Torna alla Lista</span>
        </Link>
      </div>
    </div>
  );
}
