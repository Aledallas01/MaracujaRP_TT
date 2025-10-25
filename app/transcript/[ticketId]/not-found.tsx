import Link from "next/link";
import { AlertCircle, ArrowLeft, FileText, Info } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Icona centrale di errore */}
        <div className="mx-auto h-24 w-24 bg-red-800/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg shadow-red-800/40 hover:scale-105 transform transition-all duration-300">
          <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>

        {/* Testo principale */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Transcript Non Trovato
          </h1>
          <p className="text-gray-400 text-base">
            Il transcript con l'ID specificato non esiste o non è ancora
            disponibile nel sistema.
          </p>
        </div>

        {/* Box con possibili cause */}
        <div className="bg-gray-800/70 rounded-2xl border border-gray-700/60 p-6 space-y-4 shadow-inner hover:shadow-lg hover:scale-105 transform transition-all duration-300">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-400 animate-bounce" />
            Possibili cause:
          </h2>
          <ul className="text-left text-sm text-gray-300 space-y-2 leading-relaxed">
            <li>
              • L'ID del ticket è stato inserito in modo errato{" "}
              <FileText className="inline h-4 w-4 text-orange-400 ml-1" />
            </li>
            <li>• Il transcript non è ancora stato caricato nel sistema</li>
            <li>• Il ticket è stato eliminato o archiviato</li>
          </ul>
        </div>

        {/* Pulsante di ritorno */}
        <Link
          href="/"
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Torna alla Lista</span>
        </Link>
      </div>
    </div>
  );
}
