"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Calendar, Code, Search } from "lucide-react";

interface Transcript {
  id: string;
  ticket_id: string;
  created_at: string;
  html_content: string;
  html_length?: number;
}

export default function HomePage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await fetch("/api/get-transcripts");
      if (response.ok) {
        const data = await response.json();
        const transcriptsWithInfo =
          data.transcripts?.map((t: Transcript) => ({
            ...t,
            html_length: t.html_content?.length || 0,
          })) || [];
        setTranscripts(transcriptsWithInfo);
      }
    } catch (error) {
      console.error("Error fetching transcripts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // filtriamo i transcript in base alla ricerca
  const filteredTranscripts = transcripts.filter((t) =>
    t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 text-white space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          📄 Transcript Disponibili
        </h1>
        <p className="text-gray-400 text-sm">
          Visualizza tutti i transcript salvati nel sistema.
        </p>
      </div>

      {/* Barra di ricerca */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per Ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-10 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Lista Transcript */}
      <div className="bg-gray-800/70 rounded-xl p-6 border border-gray-700/60 shadow-lg backdrop-blur-sm max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-orange-400 mr-2" />
          <h2 className="text-xl font-semibold">Elenco Transcript</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            <span className="ml-3 text-gray-400">
              Caricamento transcript...
            </span>
          </div>
        ) : filteredTranscripts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nessun transcript trovato</p>
            {searchQuery && (
              <p className="text-sm mt-2 opacity-80">
                Nessun risultato per "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
            )}
            {!searchQuery && (
              <p className="text-sm mt-2 opacity-80">
                Non ci sono ancora transcript caricati nel sistema.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTranscripts.map((transcript) => (
              <Link
                key={transcript.id}
                href={`/transcript/${transcript.ticket_id}`}
                className="group bg-gray-900/60 border border-gray-700 rounded-lg p-5 hover:border-orange-500 hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-orange-400 truncate">
                    {transcript.ticket_id}
                  </h3>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2 text-gray-400 group-hover:text-orange-400 transition-colors" />
                    <span className="truncate">HTML Transcript</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400 group-hover:text-orange-400 transition-colors" />
                    <span>{formatDate(transcript.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
