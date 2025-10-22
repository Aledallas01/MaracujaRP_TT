# 🚀 Quick Start Guide - MaracujaRP Transcript Manager

Guida rapida per mettere in funzione l'applicazione in 5 minuti.

---

## ⚡ Setup in 5 Passi

### 1️⃣ Crea Applicazione Discord (5 min)

1. Vai su https://discord.com/developers/applications
2. Click **"New Application"** → Dai un nome → **"Create"**
3. Vai su **"OAuth2"** → **"General"**
4. Copia il **Client ID**
5. Click **"Reset Secret"** → Copia il **Client Secret** (salvalo!)
6. In **"Redirects"** aggiungi:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```

---

### 2️⃣ Ottieni ID Ruolo e Server Discord (2 min)

1. Apri Discord → **Impostazioni Utente** → **Avanzate**
2. Attiva **"Modalità Sviluppatore"**
3. Vai nel tuo server → **Impostazioni Server** → **Ruoli**
4. Click destro sul ruolo admin → **"Copia ID"** (questo è DISCORD_ADMIN_ROLE_ID)
5. Click destro sul nome del server → **"Copia ID Server"** (questo è GUILD_ID)

---

### 3️⃣ Configura Variabili Ambiente (2 min)

Crea file `.env.local` nella root del progetto:

```bash
# Copia questo template e compila i valori

# Supabase (usa i tuoi valori esistenti)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Domain
NEXT_PUBLIC_DOMINIO=localhost:3000

# API Key (usa quella esistente o creane una nuova)
TRANSCRIPT_API_KEY=your-secure-api-key

# NextAuth - Genera un secret sicuro
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=RUN_THIS_COMMAND_IN_TERMINAL: openssl rand -base64 32

# Discord OAuth - Inserisci i valori dal passo 1
DISCORD_CLIENT_ID=paste_client_id_here
DISCORD_CLIENT_SECRET=paste_client_secret_here

# Discord IDs - Inserisci i valori dal passo 2
DISCORD_ADMIN_ROLE_ID=paste_role_id_here
NEXT_PUBLIC_DISCORD_GUILD_ID=paste_guild_id_here
```

**Genera NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

Copia l'output e sostituisci il valore nel file `.env.local`

---

### 4️⃣ Aggiorna Database Supabase (1 min)

1. Vai su https://supabase.com → Tuo progetto
2. Apri **SQL Editor**
3. Copia e esegui questo SQL:

```sql
-- Aggiungi colonna creator_id
ALTER TABLE transcripts
ADD COLUMN IF NOT EXISTS creator_id VARCHAR(255);

-- Crea indice per performance
CREATE INDEX IF NOT EXISTS idx_transcripts_creator_id
ON transcripts(creator_id);
```

4. Click **"Run"** ✅

---

### 5️⃣ Avvia Applicazione (1 min)

```bash
# Assicurati di essere nella directory /app
cd /app

# Avvia il server di sviluppo
yarn dev
```

Apri browser su: **http://localhost:3000**

---

## ✅ Test Funzionamento

### Test 1: Login

1. Apri http://localhost:3000
2. Dovresti vedere la pagina di login
3. Click **"Accedi con Discord"**
4. Autorizza l'app
5. ✅ Dovresti essere nella homepage

### Test 2: Upload Transcript (opzionale)

```bash
curl -X POST http://localhost:3000/api/upload-transcript \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "test-001",
    "htmlContent": "<h1>Test Transcript</h1><p>Contenuto di prova</p>",
    "creatorId": "YOUR_DISCORD_USER_ID"
  }'
```

Sostituisci:

- `your-api-key` con il valore di `TRANSCRIPT_API_KEY`
- `YOUR_DISCORD_USER_ID` con il tuo ID Discord (click destro sul tuo nome → Copia ID)

---

## 🎯 Verifica Ruoli

### Come Admin (vede tutto):

1. Assicurati di avere il ruolo configurato in `DISCORD_ADMIN_ROLE_ID`
2. Login con Discord
3. Dovresti vedere il badge **"Accesso Amministratore"**
4. Vedrai **tutti i transcript** nel sistema

### Come Utente Normale:

1. Login con account senza il ruolo admin
2. Vedrai **solo i tuoi transcript** (quelli con tuo creator_id)

---

## 🐛 Problemi Comuni

### "Invalid redirect_uri"

```bash
# Soluzione: Verifica che nel Discord Developer Portal
# ci sia esattamente questo URL nei Redirects:
http://localhost:3000/api/auth/callback/discord
```

### Server non si avvia

```bash
# Controlla che tutte le variabili siano nel file .env.local
cat .env.local

# Riavvia il server
yarn dev
```

### Non vedo transcript

```bash
# Gli utenti normali vedono solo i propri transcript
# Verifica che i transcript abbiano creator_id popolato
# Oppure usa un account con ruolo admin
```

---

## 📁 File Importanti

| File                                  | Scopo                         |
| ------------------------------------- | ----------------------------- |
| `.env.local`                          | ⚙️ Configurazione (DA CREARE) |
| `app/api/auth/[...nextauth]/route.ts` | 🔐 Config Discord OAuth       |
| `app/login/page.tsx`                  | 🚪 Pagina login               |
| `app/page.tsx`                        | 🏠 Homepage con transcript    |
| `middleware.ts`                       | 🛡️ Protezione route           |

---

## 📚 Documentazione Completa

Per maggiori dettagli:

- **SETUP_DISCORD_AUTH.md** → Guida completa Discord
- **DATABASE_MIGRATION.md** → Info database
- **API_EXAMPLES.md** → Esempi API
- **IMPLEMENTAZIONE_COMPLETA.md** → Riepilogo completo

---

## 🆘 Serve Aiuto?

1. Controlla i log del server: guarda il terminale dove hai eseguito `yarn dev`
2. Controlla i log del browser: Apri DevTools (F12) → Console
3. Verifica il file `.env.local`: tutte le variabili devono essere compilate
4. Consulta `SETUP_DISCORD_AUTH.md` per troubleshooting dettagliato

---

## 🎉 Fatto!

Se tutto funziona, vedrai:

- ✅ Pagina di login Discord
- ✅ Possibilità di fare login
- ✅ Lista transcript filtrata in base al ruolo
- ✅ Badge admin (se hai il ruolo)
- ✅ Pulsante logout nell'header

**L'applicazione è pronta all'uso!** 🚀

---

**Tempo totale setup:** ~10-15 minuti  
**Difficoltà:** ⭐⭐☆☆☆ (Facile)
