import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
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

    // 🔹 Controlla il ruolo direttamente dalla sessione (supponendo che tu salvi admin lì)
    const isAdmin = session.user.role === "admin"; // o session.user.isAdmin = true

    // 🔹 Query principale
    let query = supabase
      .from("transcripts")
      .select("id, ticket_id, created_at, html_content, creator_id", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    // Se NON è admin, mostra solo i suoi transcript
    if (!isAdmin) {
      query = query.eq("creator_id", userId);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Supabase error:", error.message, error.details);
      return NextResponse.json(
        { success: false, error: "Errore nel recupero dati da Supabase" },
        { status: 500 }
      );
    }

    const transcriptsWithInfo = (data || []).map((t) => ({
      ...t,
      html_length: t.html_content?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      transcripts: transcriptsWithInfo,
      count: count || 0,
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
