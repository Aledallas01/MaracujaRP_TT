import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Query Supabase for all transcripts
    const { data, error } = await supabase
      .from('transcripts')
      .select('id, ticket_id, username, created_at, messages')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Add message count to each transcript
    const transcriptsWithCount = data?.map(transcript => ({
      ...transcript,
      message_count: Array.isArray(transcript.messages) ? transcript.messages.length : 0
    })) || [];

    return NextResponse.json({
      success: true,
      transcripts: transcriptsWithCount
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}