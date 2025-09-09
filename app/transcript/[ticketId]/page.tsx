import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface Transcript {
  id: string;
  ticket_id: string;
  created_at: string;
  html_content: string;
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
  const transcript = await getTranscript(params.ticketId);

  if (!transcript) {
    notFound();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Torna alla lista</span>
        </Link>
      </div>

      {/* Transcript Info */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-orange-400 mb-2">
          Transcript #{transcript.ticket_id}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4 text-orange-400" />
          <span>Creato il {formatDate(transcript.created_at)}</span>
        </div>
      </div>

      {/* Transcript HTML */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 overflow-auto">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: transcript.html_content }}
        />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Transcript generato il {formatDate(transcript.created_at)} •
          MaracujaRP Server
        </p>
      </div>
    </div>
  );
}
