# Changelog - Sistema Autenticazione Discord

## Modifiche Implementate

### ✅ Autenticazione Discord OAuth

**File creati/modificati:**

- `app/api/auth/[...nextauth]/route.ts` - Configurazione NextAuth con Discord provider
- `app/login/page.tsx` - Pagina di login con pulsante Discord
- `components/auth-provider.tsx` - Provider NextAuth per gestione sessione
- `types/next-auth.d.ts` - Type definitions per TypeScript
- `middleware.ts` - Protezione automatica delle route

**Funzionalità:**

- Login tramite Discord OAuth2
- Gestione sessione con JWT
- Protezione automatica di tutte le route (tranne `/login` e API auth)

---

### ✅ Sistema di Controllo Ruoli

**File creati:**

- `app/api/check-role/route.ts` - API per verificare ruolo admin Discord

**Funzionalità:**

- Verifica se l'utente ha un ruolo specifico nel server Discord
- Configurabile tramite variabile d'ambiente `DISCORD_ADMIN_ROLE_ID`
- Integrazione con API Discord per recupero ruoli utente

---

### ✅ Field creator_id nei Transcript

**File modificati:**

- `app/api/upload-transcript/route.ts` - Aggiunto campo `creatorId` obbligatorio
- `app/api/get-transcripts/route.ts` - Filtro basato su ruolo e creator_id

**Funzionalità:**

- Ogni transcript ha un `creator_id` (Discord User ID)
- Upload richiede `creatorId` nel payload
- Filtraggio automatico basato su permessi

---

### ✅ Logica di Visualizzazione Basata su Permessi

**File modificati:**

- `app/page.tsx` - Homepage con controllo autenticazione e ruoli
- `app/layout.tsx` - Layout con pulsante logout e info utente

**Logica implementata:**

- **Utente non autenticato:** Reindirizzamento a `/login`
- **Utente con ruolo admin:** Vede tutti i transcript
- **Utente normale:** Vede solo transcript con `creator_id` uguale al suo Discord ID
- Badge "Accesso Amministratore" per utenti admin

---

### ✅ UI/UX Miglioramenti

**Modifiche:**

- Header con nome utente e pulsante logout
- Badge admin visibile per utenti con permessi elevati
- Pagina login branded con logo MaracujaRP
- Stati di loading durante verifica autenticazione
- Messaggi di errore per problemi di autenticazione

---

### 📦 Dipendenze Aggiunte

```json
{
  "next-auth": "^4.24.11"
}
```

---

### 🗄️ Modifiche Database

**Richiesta migration SQL:**

```sql
ALTER TABLE transcripts
ADD COLUMN IF NOT EXISTS creator_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_transcripts_creator_id
ON transcripts(creator_id);
```

Vedi `DATABASE_MIGRATION.md` per dettagli completi.

---

### ⚙️ Nuove Variabili d'Ambiente

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<genera con: openssl rand -base64 32>
DISCORD_CLIENT_ID=<dal Discord Developer Portal>
DISCORD_CLIENT_SECRET=<dal Discord Developer Portal>
DISCORD_ADMIN_ROLE_ID=<ID del ruolo Discord admin>
NEXT_PUBLIC_DISCORD_GUILD_ID=<ID del server Discord>
```

---

### 📚 Documentazione Creata

1. **SETUP_DISCORD_AUTH.md** - Guida completa setup autenticazione
2. **DATABASE_MIGRATION.md** - Istruzioni migration database
3. **README.md** - Documentazione progetto aggiornata
4. **.env.example** - Template variabili d'ambiente

---

## 🔄 Breaking Changes

⚠️ **IMPORTANTE:** Queste modifiche richiedono:

1. **Configurazione Discord OAuth** - Senza configurazione, l'app non funzionerà
2. **Migration Database** - La colonna `creator_id` è necessaria
3. **Variabili d'Ambiente** - Tutte le nuove variabili devono essere configurate
4. **API Upload** - L'endpoint ora richiede il campo `creatorId` obbligatorio

---

## 🚀 Deployment

Prima del deployment in produzione:

1. ✅ Esegui migration SQL su database produzione
2. ✅ Configura tutte le variabili d'ambiente
3. ✅ Aggiungi URL produzione ai redirect Discord OAuth
4. ✅ Genera nuovo `NEXTAUTH_SECRET` per produzione
5. ✅ Testa login e visualizzazione transcript

---

## 📋 Testing Checklist

- [ ] Login Discord funzionante
- [ ] Logout corretto
- [ ] Reindirizzamento automatico se non autenticato
- [ ] Utente admin vede tutti i transcript
- [ ] Utente normale vede solo i propri transcript
- [ ] Upload transcript con creator_id funzionante
- [ ] Filtro ricerca funzionante
- [ ] Badge admin visibile
- [ ] Info utente nell'header corrette

---

**Data implementazione:** 22 Ottobre 2025
**Versione:** 2.0.0 - Discord Auth Integration
