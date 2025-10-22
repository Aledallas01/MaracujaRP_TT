import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
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

    // 🔹 Parametri di paginazione
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1000;
    const page = Number(req.nextUrl.searchParams.get("page")) || 0;
    const from = page * limit;
    const to = from + limit - 1;

    // 🔹 Controllo ruolo admin tramite API Discord
    const guildId = process.env.DISCORD_GUILD_ID; // oppure passalo come query param se vuoi
    const roleCheckRes = await fetch(
      `${req.nextUrl.origin}/api/check-role?guildId=${guildId}`,
      { headers: { cookie: req.headers.get("cookie") || "" } }
    );
    const roleCheckData = await roleCheckRes.json();
    const isAdmin = roleCheckData.hasAdminRole === true;

    // 🔹 Query principale con filtro basato su ruolo
    let query = supabase
      .from("transcripts")
      .select("id, ticket_id, created_at, html_content, creator_id", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    // Se l'utente NON è admin, mostra solo i suoi transcript
    if (!isAdmin) {
      query = query.eq("creator_id", userId);
    }

    const { data, error, count } = await query.range(from, to);

    // 🔹 Gestione errori Supabase
    if (error) {
      console.error("Supabase error:", error.message, error.details);
      return NextResponse.json(
        { success: false, error: "Errore nel recupero dati da Supabase" },
        { status: 500 }
      );
    }

    // 🔹 Se nessun dato trovato
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        transcripts: [],
        count: 0,
        page,
        totalPages: 0,
      });
    }

    // 🔹 Aggiunge info utili (es. lunghezza HTML)
    const transcriptsWithInfo = data.map((t) => ({
      ...t,
      html_length: t.html_content?.length || 0,
    }));

    // 🔹 Risposta finale
    return NextResponse.json({
      success: true,
      transcripts: transcriptsWithInfo,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err: any) {
    console.error("API Error:", err.message || err);
    return NextResponse.json(
      { success: false, error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
