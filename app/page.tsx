"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  User,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";

interface Transcript {
  id: string;
  ticket_id: string;
  created_at: string;
  html_content: string;
  html_length?: number;
  creator_id?: string;
  creator_name?: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const isAdmin = session.hasAdminRole || false;
      setHasAdminRole(isAdmin);
      fetchTranscripts(isAdmin);
    }
  }, [status, router, session]);

  const fetchTranscripts = async (isAdminParam: boolean) => {
    try {
      const response = await fetch(
        `/api/get-transcripts?hasAdminRole=${isAdminParam}`
      );
      if (response.status === 401) {
        router.push("/login");
        return;
      }
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

  const filteredTranscripts = transcripts.filter((t) =>
    t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-orange-400"></div>
          </div>
          <p className="text-gray-400 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 text-white space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 mb-2 flex-wrap justify-center">
          <Sparkles className="h-6 w-6 text-orange-400 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            Transcript Disponibili
          </h1>
          <Sparkles className="h-6 w-6 text-orange-400 animate-pulse" />
        </div>
        <p className="text-gray-400 text-sm sm:text-base">
          {hasAdminRole
            ? "Visualizza tutti i transcript salvati nel sistema"
            : "Visualizza i tuoi transcript"}
        </p>
        {hasAdminRole && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Shield className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="text-xs sm:text-sm font-semibold">
              Accesso Amministratore
            </span>
          </div>
        )}
      </div>

      {/* Barra di ricerca */}
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
          <input
            type="text"
            placeholder="Cerca per Ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-10 sm:px-12 py-3.5 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 backdrop-blur-sm"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Lista Transcript */}
      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl p-6 sm:p-8 border border-gray-700/60 shadow-2xl backdrop-blur-sm max-w-6xl mx-auto">
        <div className="flex items-center mb-6 sm:mb-8">
          <FileText className="h-6 sm:h-7 w-6 sm:w-7 text-orange-400 mr-3" />
          <h2 className="text-xl sm:text-2xl font-bold">Elenco Transcript</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="relative animate-spin rounded-full h-10 w-10 border-b-2 border-orange-400"></div>
            </div>
            <span className="ml-4 text-gray-400 font-medium">
              Caricamento transcript...
            </span>
          </div>
        ) : filteredTranscripts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="h-16 w-16 mx-auto mb-6 opacity-30" />
            <p className="text-lg sm:text-xl font-semibold mb-2">
              Nessun transcript trovato
            </p>
            {searchQuery && (
              <p className="text-sm sm:text-base mt-3 opacity-80">
                Nessun risultato per "
                <span className="font-semibold text-orange-400">
                  {searchQuery}
                </span>
                "
              </p>
            )}
            {!searchQuery && (
              <p className="text-sm sm:text-base mt-3 opacity-80">
                Non ci sono ancora transcript caricati nel sistema.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTranscripts.map((transcript) => (
              <Link
                key={transcript.id}
                href={`/transcript/${transcript.ticket_id}`}
                className="group bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-700 rounded-xl p-4 sm:p-6 hover:border-orange-500 hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 backdrop-blur-sm"
                data-testid={`transcript-card-${transcript.ticket_id}`}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="font-bold text-base sm:text-lg text-orange-400 group-hover:text-orange-300 truncate transition-colors">
                    {transcript.ticket_id}
                  </h3>
                  <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:scale-150 transition-transform"></div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center">
                    <User className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-2 text-gray-400 group-hover:text-orange-400 transition-colors" />
                    <span className="truncate">{transcript.creator_name}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-2 text-gray-400 group-hover:text-orange-400 transition-colors" />
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
