import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, MessageSquare, Clock } from 'lucide-react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface Transcript {
  id: string;
  ticket_id: string;
  username: string;
  created_at: string;
  messages: Message[];
}

async function getTranscript(ticketId: string): Promise<Transcript | null> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/get-transcript/${ticketId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

export default async function TranscriptPage({ 
  params 
}: { 
  params: { ticketId: string } 
}) {
  const transcript = await getTranscript(params.ticketId);

  if (!transcript) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Torna alla lista</span>
        </Link>
      </div>

      {/* Transcript Info */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-orange-400">
            Transcript #{transcript.ticket_id}
          </h1>
          <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">
            {transcript.messages.length} messaggi
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-orange-400" />
            <span className="text-gray-400">Utente:</span>
            <span className="font-medium text-white">{transcript.username}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span className="text-gray-400">Creato:</span>
            <span className="font-medium text-white">
              {formatDate(transcript.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">
              Conversazione
            </h2>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <div className="p-6 space-y-4">
            {transcript.messages.map((message, index) => (
              <div 
                key={message.id || index}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-orange-400">
                      {message.user}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatMessageTime(message.timestamp)}</span>
                  </div>
                </div>
                
                <div className="text-gray-200 leading-relaxed">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Transcript generato il {formatDate(transcript.created_at)} • MaracujaRP Server
        </p>
      </div>
    </div>
  );
}