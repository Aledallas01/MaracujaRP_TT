import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import UnauthorizedAccess from "@/components/unauthorized-access";

export const dynamic = "force-dynamic";

interface Transcript {
  id: string;
  ticket_id: string;
  created_at: string;
  html_content: string;
  creator_id?: string;
  creator_name?: string;
}

// Supabase client con SERVICE ROLE KEY (server-only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getTranscript(ticketId: string): Promise<Transcript | null> {
  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .eq("ticket_id", ticketId)
    .single();

  if (error || !data) {
    console.error("Transcript fetch error:", error);
    return null;
  }

  return data;
}

export default async function TranscriptPage({
  params,
}: {
  params: { ticketId: string };
}) {
  // 🔒 Controllo autenticazione
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.discordId;
  const hasAdminRole = session.hasAdminRole || false;

  const transcript = await getTranscript(params.ticketId);

  // Se il transcript non esiste
  if (!transcript) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Transcript Non Trovato
          </h1>
          <p className="text-gray-400">Il transcript richiesto non esiste.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna alla lista</span>
          </Link>
        </div>
      </div>
    );
  }

  // 🔒 Controllo permessi: solo admin o creatore del ticket
  if (!hasAdminRole && transcript.creator_id !== userId) {
    return <UnauthorizedAccess />;
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-all duration-200 hover:gap-3"
          data-testid="back-to-list-button"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Torna alla lista</span>
        </Link>

        {hasAdminRole && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-300 px-4 py-2 rounded-lg shadow-lg">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Vista Admin</span>
          </div>
        )}
      </div>

      {/* Transcript Info */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
          Transcript #{transcript.ticket_id}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4 text-orange-400" />
          <span>
            Creato da {transcript.creator_name}, il{" "}
            {formatDate(transcript.created_at)}
          </span>
        </div>
      </div>

      {/* Transcript HTML */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-700 p-8 overflow-auto shadow-xl hover:shadow-2xl transition-all duration-300">
        <div
          className="prose prose-invert max-w-none prose-headings:text-orange-400 prose-a:text-orange-400 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: transcript.html_content }}
        />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p className="flex items-center justify-center gap-2">
          <span>
            Transcript generato il {formatDate(transcript.created_at)}
          </span>
          <span>•</span>
          <span className="text-orange-400 font-medium">
            {transcript.creator_name}
          </span>
        </p>
      </div>
    </div>
  );
}
