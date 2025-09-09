import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("transcripts")
      .select("id, ticket_id, html_content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Aggiungo lunghezza HTML come "html_length"
    const transcriptsWithInfo =
      data?.map((t) => ({
        ...t,
        html_length: t.html_content?.length || 0,
      })) || [];

    return NextResponse.json({
      success: true,
      transcripts: transcriptsWithInfo,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
