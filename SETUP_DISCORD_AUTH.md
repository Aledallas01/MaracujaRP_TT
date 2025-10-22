# Guida Setup Autenticazione Discord

Questa guida ti aiuterà a configurare l'autenticazione Discord per il sistema MaracujaRP Transcript Manager.

## 📋 Prerequisiti

1. Account Discord Developer
2. Server Discord per il tuo progetto
3. Database Supabase configurato

---

## 🎮 Passo 1: Creare l'Applicazione Discord

1. Vai su [Discord Developer Portal](https://discord.com/developers/applications)
2. Clicca su **"New Application"**
3. Dai un nome all'applicazione (es. "MaracujaRP Transcript Manager")
4. Clicca su **"Create"**

---

## 🔑 Passo 2: Configurare OAuth2

1. Nel menu laterale, vai su **"OAuth2"** → **"General"**
2. Copia il **Client ID** (lo userai nel file `.env`)
3. Clicca su **"Reset Secret"** per generare un nuovo **Client Secret**
4. Copia il **Client Secret** (⚠️ salvalo in un posto sicuro, non potrai vederlo di nuovo!)
5. Nelle **Redirects**, aggiungi questi URL:
   - Per sviluppo locale: `http://localhost:3000/api/auth/callback/discord`
   - Per produzione: `https://tuo-dominio.com/api/auth/callback/discord`

---

## 🎭 Passo 3: Ottenere l'ID del Ruolo Discord

1. Apri Discord e vai nel tuo server
2. Vai su **Impostazioni Server** → **Ruoli**
3. Clicca sul ruolo che vuoi usare per gli amministratori (che possono vedere tutti i transcript)
4. Nelle impostazioni del ruolo, copia l'**ID del ruolo**
   - Se non vedi l'ID, abilita la **Modalità Sviluppatore** in Discord:
     - Impostazioni Utente → Avanzate → Modalità Sviluppatore (ON)
   - Poi torna ai ruoli, clicca col tasto destro sul ruolo e seleziona **"Copia ID"**

---

## 🎯 Passo 4: Ottenere l'ID del Server Discord (Guild ID)

1. Con la **Modalità Sviluppatore** abilitata
2. Clicca col tasto destro sul nome del tuo server nella lista server
3. Seleziona **"Copia ID Server"**
4. Questo è il tuo Guild ID

---

## ⚙️ Passo 5: Configurare il file .env

Crea un file `.env` (o `.env.local`) nella root del progetto e aggiungi queste variabili:

```bash
# Supabase Configuration (già presenti)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Domain Configuration
NEXT_PUBLIC_DOMINIO=your-domain.com

# API Configuration
TRANSCRIPT_API_KEY=your-transcript-api-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Discord OAuth Configuration
DISCORD_CLIENT_ID=il-client-id-copiato-dal-portal
DISCORD_CLIENT_SECRET=il-client-secret-copiato-dal-portal

# Discord Role & Guild Configuration
DISCORD_ADMIN_ROLE_ID=id-del-ruolo-admin
NEXT_PUBLIC_DISCORD_GUILD_ID=id-del-server-discord
```

### Generare NEXTAUTH_SECRET

Esegui questo comando nel terminale per generare un secret sicuro:

```bash
openssl rand -base64 32
```

Copia l'output e usalo come valore per `NEXTAUTH_SECRET`.

---

## 🗄️ Passo 6: Aggiornare il Database Supabase

Esegui la migration SQL per aggiungere la colonna `creator_id`. Vedi il file `DATABASE_MIGRATION.md` per i dettagli.

---

## 🚀 Passo 7: Testare l'Autenticazione

1. Avvia il server di sviluppo:

   ```bash
   npm run dev
   # oppure
   yarn dev
   ```

2. Apri il browser su `http://localhost:3000`
3. Dovresti essere reindirizzato alla pagina di login
4. Clicca su **"Accedi con Discord"**
5. Autorizza l'applicazione Discord
6. Dovresti essere reindirizzato alla homepage con i tuoi transcript

---

## 🔒 Come Funziona il Sistema di Permessi

### Utente con Ruolo Admin

- Può vedere **tutti i transcript** nel sistema
- Visualizza il badge "Accesso Amministratore"

### Utente Normale

- Può vedere **solo i propri transcript** (dove `creator_id` corrisponde al suo Discord ID)
- Non vede i transcript di altri utenti

### Utente Non Autenticato

- **Non può accedere** a nessuna pagina
- Viene reindirizzato automaticamente alla pagina di login

---

## 📝 API Upload Transcript - Esempio

Quando carichi un transcript tramite API, ora devi includere il `creatorId`:

```bash
curl -X POST https://tuo-dominio.com/api/upload-transcript \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "ticket-123",
    "htmlContent": "<html>...</html>",
    "creatorId": "123456789012345678"
  }'
```

Il `creatorId` deve essere l'**ID Discord** dell'utente che ha creato il transcript.

---

## 🐛 Troubleshooting

### Errore: "Invalid redirect_uri"

- Verifica che l'URL di callback sia aggiunto correttamente nel Discord Developer Portal
- Controlla che `NEXTAUTH_URL` nel `.env` corrisponda all'URL effettivo

### Errore: "Cannot read properties of undefined (reading 'id')"

- Verifica che tutte le variabili d'ambiente Discord siano configurate correttamente
- Riavvia il server dopo aver modificato il file `.env`

### Ruolo admin non funziona

- Verifica che `DISCORD_ADMIN_ROLE_ID` sia corretto
- Verifica che `NEXT_PUBLIC_DISCORD_GUILD_ID` sia l'ID del server giusto
- Controlla che l'utente abbia effettivamente quel ruolo nel server Discord

### Non vedo nessun transcript

- Se sei un utente normale, vedrai solo i transcript con il tuo `creator_id`
- Verifica che i transcript nel database abbiano la colonna `creator_id` popolata

---

## 📚 Risorse Utili

- [Discord Developer Portal](https://discord.com/developers/applications)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)

---

## ✅ Checklist Finale

- [ ] Applicazione Discord creata
- [ ] Client ID e Client Secret ottenuti
- [ ] Redirect URI configurati
- [ ] ID Ruolo Admin ottenuto
- [ ] Guild ID ottenuto
- [ ] File `.env` configurato con tutti i valori
- [ ] Database Supabase aggiornato con colonna `creator_id`
- [ ] Server di sviluppo avviato e testato
- [ ] Login Discord funzionante
- [ ] Visualizzazione transcript funzionante

---

Se hai domande o problemi, consulta la documentazione o contatta il supporto tecnico.
