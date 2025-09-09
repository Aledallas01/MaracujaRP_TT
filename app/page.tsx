'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Upload, Calendar, User } from 'lucide-react';

interface Transcript {
  id: string;
  ticket_id: string;
  username: string;
  created_at: string;
  message_count: number;
}

export default function HomePage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    ticketId: '',
    messages: ''
  });

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('/api/get-transcripts');
      if (response.ok) {
        const data = await response.json();
        setTranscripts(data.transcripts || []);
      }
    } catch (error) {
      console.error('Error fetching transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.ticketId || !uploadData.messages) return;

    setUploading(true);
    try {
      // Parse messages from textarea (expecting JSON format)
      const messages = JSON.parse(uploadData.messages);
      
      const response = await fetch('/api/upload-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: uploadData.ticketId,
          messages: messages
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Transcript caricato con successo! ID: ${result.ticketId}`);
        setUploadData({ ticketId: '', messages: '' });
        fetchTranscripts(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Errore: ${error.error}`);
      }
    } catch (error) {
      alert('Errore nel formato JSON dei messaggi');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center mb-4">
          <Upload className="h-6 w-6 text-orange-400 mr-2" />
          <h2 className="text-xl font-semibold">Carica Nuovo Transcript</h2>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="ticketId" className="block text-sm font-medium text-gray-300 mb-2">
              Ticket ID
            </label>
            <input
              type="text"
              id="ticketId"
              value={uploadData.ticketId}
              onChange={(e) => setUploadData({ ...uploadData, ticketId: e.target.value })}
              placeholder="es: TICKET-001"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="messages" className="block text-sm font-medium text-gray-300 mb-2">
              Messaggi (formato JSON)
            </label>
            <textarea
              id="messages"
              value={uploadData.messages}
              onChange={(e) => setUploadData({ ...uploadData, messages: e.target.value })}
              placeholder='[{"user": "Admin", "content": "Ciao, come posso aiutarti?", "timestamp": "2025-01-01T10:00:00Z"}]'
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading || !uploadData.ticketId || !uploadData.messages}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Caricamento...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Carica Transcript</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transcripts List */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-orange-400 mr-2" />
          <h2 className="text-xl font-semibold">Transcript Disponibili</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            <span className="ml-3 text-gray-400">Caricamento transcript...</span>
          </div>
        ) : transcripts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessun transcript disponibile</p>
            <p className="text-sm mt-2">Carica il primo transcript usando il form sopra</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transcripts.map((transcript) => (
              <Link
                key={transcript.id}
                href={`/transcript/${transcript.ticket_id}`}
                className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-4 border border-gray-600 hover:border-orange-500 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-orange-400 truncate">
                    {transcript.ticket_id}
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                    {transcript.message_count} msg
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{transcript.username}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDate(transcript.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}