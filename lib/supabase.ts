import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for transcript data
export interface Message {
  id?: string;
  user: string;
  content: string;
  timestamp: string;
}

export interface Transcript {
  id: string;
  ticket_id: string;
  username: string;
  messages: Message[];
  created_at: string;
  updated_at?: string;
  creator_name?: string;
}

// Helper function to get transcript by ticket ID
export async function getTranscriptByTicketId(ticketId: string) {
  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .eq("ticket_id", ticketId)
    .single();

  if (error) {
    console.error("Error fetching transcript:", error);
    return null;
  }

  return data as Transcript;
}

// Helper function to get all transcripts
export async function getAllTranscripts() {
  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transcripts:", error);
    return [];
  }

  return data as Transcript[];
}

// Helper function to create a new transcript
export async function createTranscript(transcriptData: {
  ticket_id: string;
  username: string;
  messages: Message[];
}) {
  const { data, error } = await supabase
    .from("transcripts")
    .insert([transcriptData])
    .select()
    .single();

  if (error) {
    console.error("Error creating transcript:", error);
    throw new Error("Failed to create transcript");
  }

  return data as Transcript;
}
