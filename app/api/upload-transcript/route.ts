// app/api/upload-transcript/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const dominio = process.env.NEXT_PUBLIC_DOMINIO!;
const supabase = createClient(supabaseUrl, supabaseKey);

function authenticateRequest(request: NextRequest): boolean {
  const apiKey = process.env.TRANSCRIPT_API_KEY;
  if (!apiKey) return true; // accesso aperto se API key non configurata

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7); // rimuove "Bearer "
  return token === apiKey;
}

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Controllo API Key
    if (!authenticateRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: API key mancante o non valida",
        },
        { status: 401 }
      );
    }

    // 2️⃣ Parse body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { ticketId, htmlContent, creatorId } = body;

    if (!ticketId || !htmlContent) {
      return NextResponse.json(
        { success: false, message: "ticketId e htmlContent sono richiesti" },
        { status: 400 }
      );
    }

    if (!creatorId) {
      return NextResponse.json(
        { success: false, message: "creatorId è richiesto" },
        { status: 400 }
      );
    }

    // 3️⃣ Controlla se transcript già esiste
    const { data: existingTranscript, error: checkError } = await supabase
      .from("transcripts")
      .select("id")
      .eq("ticket_id", ticketId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Errore checking transcript:", checkError);
      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 }
      );
    }

    // 4️⃣ Inserisci o aggiorna transcript con HTML e creator_id
    let upsertResult;
    if (existingTranscript) {
      // Aggiorna il transcript esistente
      const { data, error } = await supabase
        .from("transcripts")
        .update({ html_content: htmlContent, creator_id: creatorId })
        .eq("ticket_id", ticketId)
        .select()
        .single();
      upsertResult = { data, error };
    } else {
      // Inserisci nuovo transcript
      const { data, error } = await supabase
        .from("transcripts")
        .insert([{ 
          ticket_id: ticketId, 
          html_content: htmlContent,
          creator_id: creatorId 
        }])
        .select()
        .single();
      upsertResult = { data, error };
    }

    if (upsertResult.error) {
      console.error(
        "Errore inserimento/aggiornamento transcript:",
        upsertResult.error
      );
      return NextResponse.json(
        { success: false, message: "Errore nel DB" },
        { status: 500 }
      );
    }

    // 5️⃣ Risposta
    return NextResponse.json({
      success: true,
      url: `https://${dominio}/transcript/${ticketId}`,
      message: existingTranscript
        ? "Transcript aggiornato con successo."
        : "Transcript caricato con successo.",
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET opzionale per debugging
export async function GET() {
  return NextResponse.json(
    { message: "Upload transcript endpoint - usa POST" },
    { status: 405 }
  );
}
