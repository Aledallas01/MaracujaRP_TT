import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // 🔹 Parametri di paginazione
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1000;
    const page = Number(req.nextUrl.searchParams.get("page")) || 0;
    const from = page * limit;
    const to = from + limit - 1;

    // 🔹 Query principale
    const { data, error, count } = await supabase
      .from("transcripts")
      // seleziona solo i campi necessari per migliorare le performance
      .select("id, title, created_at, html_content", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

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
