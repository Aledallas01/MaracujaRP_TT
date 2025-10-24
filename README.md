# MaracujaRP Transcript Manager 📄

Sistema di gestione transcript per MaracujaRP Server con autenticazione Discord.

## 🚀 Funzionalità

- ✅ **Autenticazione Discord OAuth** obbligatoria
- ✅ **Sistema di permessi basato su ruoli**
  - Utenti con ruolo admin: vedono tutti i transcript
  - Utenti normali: vedono solo i propri transcript
- ✅ **Upload transcript tramite API** con tracking del creatore
- ✅ **Interfaccia moderna** con React e Tailwind CSS
- ✅ **Database Supabase** per storage sicuro

## 📋 Setup Rapido

1. **Installa le dipendenze:**

   ```bash
   npm install
   # oppure
   yarn install
   ```

2. **Configura le variabili d'ambiente:**

   - Copia `.env.example` in `.env.local`
   - Compila tutte le variabili necessarie (vedi `SETUP_DISCORD_AUTH.md`)

3. **Aggiorna il database Supabase:**

   - Esegui la migration SQL (vedi `DATABASE_MIGRATION.md`)

4. **Avvia il server di sviluppo:**

   ```bash
   npm run dev
   # oppure
   yarn dev
   ```

5. **Apri il browser:**
   - Vai su `http://localhost:3000`
   - Effettua il login con Discord

## 📚 Documentazione

- **[SETUP_DISCORD_AUTH.md](./SETUP_DISCORD_AUTH.md)** - Guida completa per configurare l'autenticazione Discord
- **[DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)** - Modifiche necessarie al database Supabase

## 🔑 Variabili d'Ambiente Richieste

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# NextAuth
NEXTAUTH_URL
NEXTAUTH_SECRET

# Discord OAuth
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
DISCORD_ADMIN_ROLE_ID
NEXT_PUBLIC_DISCORD_GUILD_ID

# Altre configurazioni
NEXT_PUBLIC_DOMINIO
TRANSCRIPT_API_KEY
```

## 🔒 Sistema di Permessi

### Utente Admin (con ruolo specifico)

- Vede **tutti i transcript** nel sistema
- Badge "Accesso Amministratore" visibile

### Utente Normale

- Vede **solo i propri transcript**
- Filtraggio automatico basato su Discord ID

### Non Autenticato

- **Accesso negato** a tutte le pagine
- Reindirizzamento automatico al login

## 📝 API Endpoints

### POST /api/upload-transcript

Carica un nuovo transcript o aggiorna uno esistente.

**Headers:**

```bash
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body:**

```json
{
  "ticketId": "ticket-123",
  "htmlContent": "<html>...</html>",
  "creatorId": "discord-user-id"
}
```

### GET /api/get-transcripts

Recupera i transcript accessibili all'utente autenticato.

**Query Parameters:**

- `hasAdminRole` (boolean): Se true, restituisce tutti i transcript
- `limit` (number): Numero massimo di risultati (default: 1000)
- `page` (number): Pagina corrente per paginazione (default: 0)

### GET /api/check-role

Verifica se l'utente ha il ruolo admin.

**Query Parameters:**

- `guildId` (string): ID del server Discord

## 🛠️ Tech Stack

- **Frontend:** Next.js 13, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js con Discord Provider
- **Database:** Supabase (PostgreSQL)
- **UI Components:** Radix UI

## 🔧 Sviluppo

```bash
# Installa dipendenze
yarn install

# Avvia dev server
yarn dev

# Build per produzione
yarn build

# Avvia produzione
yarn start

# Lint
yarn lint
```

## 📦 Struttura Progetto

```bash
/app
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   ├── check-role/             # Role verification endpoint
│   │   ├── get-transcripts/        # Get transcripts endpoint
│   │   └── upload-transcript/      # Upload transcript endpoint
│   ├── login/                      # Login page
│   ├── transcript/[ticketId]/      # Transcript detail page
│   ├── layout.tsx                  # Root layout with auth
│   └── page.tsx                    # Home page (transcript list)
├── components/
│   ├── auth-provider.tsx           # NextAuth session provider
│   └── ui/                         # UI components
├── types/
│   └── next-auth.d.ts              # TypeScript definitions
└── middleware.ts                   # Route protection middleware
```

## 🆘 Troubleshooting

Consulta `SETUP_DISCORD_AUTH.md` per problemi comuni e soluzioni.

## 📄 License

Proprietario - MaracujaRP Server

---

**Nota:** Assicurati di configurare correttamente tutte le variabili d'ambiente prima di avviare l'applicazione.
