import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    // 🔒 Controllo autenticazione
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Non autenticato. Login richiesto." },
        { status: 401 }
      );
    }

    const userId = session.user.discordId;
    const { ticketId } = params;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: "Ticket ID mancante" },
        { status: 400 }
      );
    }

    // 🔹 Controllo ruolo admin tramite API Discord
    const guildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID;
    const roleCheckRes = await fetch(
      `${req.nextUrl.origin}/api/check-role?guildId=${guildId}`,
      { headers: { cookie: req.headers.get("cookie") || "" } }
    );
    const roleCheckData = await roleCheckRes.json();
    const isAdmin = roleCheckData.hasAdminRole === true;

    // 🔹 Query transcript
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("ticket_id", ticketId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Transcript non trovato" },
          { status: 404 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Errore nel recupero dati da Supabase" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Transcript non trovato" },
        { status: 404 }
      );
    }

    // 🔒 Controllo permessi: solo admin o creatore del ticket
    if (!isAdmin && data.creator_id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Non hai i permessi per visualizzare questo transcript",
        },
        { status: 403 }
      );
    }

    // 🔹 Aggiunge info extra
    const transcriptWithInfo = {
      ...data,
      html_length: data.html_content?.length || 0,
    };

    return NextResponse.json({
      success: true,
      transcript: transcriptWithInfo,
    });
  } catch (err: any) {
    console.error("API Error:", err.message || err);
    return NextResponse.json(
      { success: false, error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
