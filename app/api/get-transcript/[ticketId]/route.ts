import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    // 🔒 Controllo autenticazione
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autenticato. Login richiesto." },
        { status: 401 }
      );
    }

    const userId = session.user.discordId;
    const { ticketId } = params;

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Query Supabase for transcript
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("ticket_id", ticketId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json(
          { error: "Transcript not found" },
          { status: 404 }
        );
      }

      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // 🔒 Verifica permessi: controlla se l'utente può accedere a questo transcript
    const hasAdminRole =
      request.nextUrl.searchParams.get("hasAdminRole") === "true";

    if (!hasAdminRole && data.creator_id !== userId) {
      return NextResponse.json(
        { error: "Non hai i permessi per visualizzare questo transcript" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript: data,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
