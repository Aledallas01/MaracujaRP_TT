import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-red-900 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Transcript Non Trovato
          </h1>
          <p className="text-gray-400">
            Il transcript con l'ID specificato non esiste nel sistema.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Possibili cause:
          </h2>
          <ul className="text-left text-sm text-gray-300 space-y-2">
            <li>• L'ID del ticket è stato inserito in modo errato</li>
            <li>• Il transcript non è ancora stato caricato nel sistema</li>
            <li>• Il ticket è stato eliminato o archiviato</li>
          </ul>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Torna alla Lista</span>
        </Link>
      </div>
    </div>
  );
}