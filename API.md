# API Examples - MaracujaRP Transcript Manager

Esempi di utilizzo delle API con il nuovo sistema di autenticazione.

## 📝 Upload Transcript

### Endpoint

```bash
POST /api/upload-transcript
```

### Headers

```bash
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Body (Nuovo formato con creator_id)

```json
{
  "ticketId": "ticket-12345",
  "htmlContent": "<html><body><h1>Transcript</h1>...</body></html>",
  "creatorId": "123456789012345678"
}
```

### cURL Example

```bash
curl -X POST https://your-domain.com/api/upload-transcript \
  -H "Authorization: Bearer your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "ticket-12345",
    "htmlContent": "<html><body><h1>Transcript Content</h1></body></html>",
    "creatorId": "123456789012345678"
  }'
```

### Response Success

```json
{
  "success": true,
  "url": "https://your-domain.com/transcript/ticket-12345",
  "message": "Transcript caricato con successo."
}
```

### Response Error (Missing creatorId)

```json
{
  "success": false,
  "message": "creatorId è richiesto"
}
```

---

## 📋 Get All Transcripts (Richiede Autenticazione)

### Endpoint (get-transcripts)

```bash
GET /api/get-transcripts
```

### Query Parameters (get-transcripts)

- `hasAdminRole` (boolean): Se true, restituisce tutti i transcript
- `limit` (number, optional): Numero massimo di risultati (default: 1000)
- `page` (number, optional): Pagina per paginazione (default: 0)

### Headers (Cookie Session - gestito automaticamente dal browser)

```bash
Cookie: next-auth.session-token=...
```

### cURL Example (Con session token)

```bash
curl -X GET "https://your-domain.com/api/get-transcripts?hasAdminRole=false&limit=100&page=0" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### Response Success (Admin)

```json
{
  "success": true,
  "transcripts": [
    {
      "id": "uuid-1",
      "ticket_id": "ticket-123",
      "created_at": "2025-01-15T10:30:00Z",
      "html_content": "<html>...</html>",
      "creator_id": "123456789012345678",
      "html_length": 1024
    },
    {
      "id": "uuid-2",
      "ticket_id": "ticket-456",
      "created_at": "2025-01-14T15:20:00Z",
      "html_content": "<html>...</html>",
      "creator_id": "987654321098765432",
      "html_length": 2048
    }
  ],
  "count": 2,
  "page": 0,
  "totalPages": 1
}
```

### Response Success (Utente Normale - solo propri transcript)

```json
{
  "success": true,
  "transcripts": [
    {
      "id": "uuid-1",
      "ticket_id": "ticket-123",
      "created_at": "2025-01-15T10:30:00Z",
      "html_content": "<html>...</html>",
      "creator_id": "123456789012345678",
      "html_length": 1024
    }
  ],
  "count": 1,
  "page": 0,
  "totalPages": 1
}
```

### Response Error (Non Autenticato)

```json
{
  "success": false,
  "error": "Non autenticato. Login richiesto."
}
```

---

## 🔍 Get Single Transcript

### Endpoint (get-transcript)

```bash
GET /api/get-transcript/[ticketId]
```

### Query Parameters (AdminRole)

- `hasAdminRole` (boolean): Se true, bypassa il controllo proprietà

### Headers (Cookie Session)

```bash
Cookie: next-auth.session-token=...
```

### cURL Example

```bash
curl -X GET "https://your-domain.com/api/get-transcript/ticket-123?hasAdminRole=false" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### Response Success

```json
{
  "success": true,
  "transcript": {
    "id": "uuid-1",
    "ticket_id": "ticket-123",
    "created_at": "2025-01-15T10:30:00Z",
    "html_content": "<html>...</html>",
    "creator_id": "123456789012345678"
  }
}
```

### Response Error (Non Autorizzato)

```json
{
  "error": "Non hai i permessi per visualizzare questo transcript"
}
```

### Response Error (Non Trovato)

```json
{
  "error": "Transcript not found"
}
```

---

## 🛡️ Check User Role

### Endpoint (check-role)

```bash
GET /api/check-role
```

### Query Parameters (Obbligatorio)

- `guildId` (string): ID del server Discord

### Headers (Cookie Session)

```bash
Cookie: next-auth.session-token=...
```

### cURL Example

```bash
curl -X GET "https://your-domain.com/api/check-role?guildId=987654321098765432" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### Response Success (Ha il ruolo admin)

```json
{
  "success": true,
  "hasAdminRole": true,
  "userId": "123456789012345678"
}
```

### Response Success (Non ha il ruolo admin)

```json
{
  "success": true,
  "hasAdminRole": false,
  "userId": "123456789012345678"
}
```

### Response Error (Non Autenticato)

```json
{
  "success": false,
  "hasAdminRole": false,
  "error": "Not authenticated"
}
```

---

## 🔐 Authentication Flow

### 1. Login (Frontend)

```javascript
import { signIn } from "next-auth/react";

// Inizia il flusso di login Discord
await signIn("discord", { callbackUrl: "/" });
```

### 2. Logout (Frontend)

```javascript
import { signOut } from "next-auth/react";

// Logout utente
await signOut({ callbackUrl: "/login" });
```

### 3. Get Session (Frontend)

```javascript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      Logged in as: {session.user.name}
      Discord ID: {session.user.discordId}
    </div>
  );
}
```

---

## 🎯 Integration Example (Discord Bot)

Esempio di integrazione da un bot Discord che carica transcript:

```python
import requests
import os

# Configurazione
API_URL = "https://your-domain.com/api/upload-transcript"
API_KEY = os.getenv("TRANSCRIPT_API_KEY")

def upload_transcript(ticket_id: str, html_content: str, creator_discord_id: str):
    """
    Carica un transcript nel sistema

    Args:
        ticket_id: ID del ticket Discord
        html_content: Contenuto HTML del transcript
        creator_discord_id: Discord User ID del creatore
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "ticketId": ticket_id,
        "htmlContent": html_content,
        "creatorId": creator_discord_id
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        print(f"✅ Transcript caricato: {data['url']}")
        return data['url']
    else:
        print(f"❌ Errore: {response.text}")
        return None

# Esempio di utilizzo
ticket_url = upload_transcript(
    ticket_id="ticket-12345",
    html_content="<html><body><h1>Transcript</h1></body></html>",
    creator_discord_id="123456789012345678"
)
```

---

## 📊 Testing with Postman

### Collection Setup

1. **Create Environment Variables:**

   - `base_url`: https://your-domain.com
   - `api_key`: your-transcript-api-key
   - `session_token`: (obtained after login)

2. **Import cURL Commands:**

   - Usa gli esempi cURL sopra per creare le request in Postman

3. **Set Authorization:**
   - Per `/api/upload-transcript`: Bearer Token con `{{api_key}}`
   - Per altri endpoint: Cookie con `next-auth.session-token={{session_token}}`

---

## ⚠️ Important Notes

1. **creator_id è obbligatorio** per l'upload di nuovi transcript
2. **Session token** viene gestito automaticamente dal browser dopo il login
3. **API key** per upload deve essere configurata in `.env` come `TRANSCRIPT_API_KEY`
4. Tutti gli endpoint (tranne upload) richiedono **autenticazione Discord**
5. Gli utenti vedono solo i **propri transcript** a meno che non abbiano il **ruolo admin**

---

## 🔄 Migration from Old API

Se stai migrando da una versione precedente:

### Old Format (Non più supportato)

```json
{
  "ticketId": "ticket-123",
  "htmlContent": "<html>...</html>"
}
```

### New Format (Obbligatorio)

```json
{
  "ticketId": "ticket-123",
  "htmlContent": "<html>...</html>",
  "creatorId": "123456789012345678"
}
```

**Azione richiesta:** Aggiorna tutti i tuoi script/bot per includere il campo `creatorId`.
