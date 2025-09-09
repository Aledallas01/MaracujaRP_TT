import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Message {
  user: string;
  content: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { ticketId, messages }: { ticketId: string; messages: Message[] } =
      body;

    // Validate required fields
    if (!ticketId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          error: "Missing required fields: ticketId and messages array",
        },
        { status: 400 }
      );
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.user || !message.content || !message.timestamp) {
        return NextResponse.json(
          {
            error: "Each message must have user, content, and timestamp fields",
          },
          { status: 400 }
        );
      }
    }

    // Check if transcript already exists
    const { data: existingTranscript, error: checkError } = await supabase
      .from("transcripts")
      .select("id")
      .eq("ticket_id", ticketId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing transcript:", checkError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existingTranscript) {
      return NextResponse.json(
        { error: "Transcript with this ticket ID already exists" },
        { status: 409 }
      );
    }

    // Get the first user as the main username (usually the ticket creator)
    const username = messages[0]?.user || "Unknown";

    // Insert new transcript
    const { data, error } = await supabase
      .from("transcripts")
      .insert([
        {
          ticket_id: ticketId,
          username: username,
          messages: messages,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create transcript" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticketId: data.ticket_id,
      message: "Transcript uploaded successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Upload transcript endpoint - use POST method" },
    { status: 405 }
  );
}
