# Modifiche Database Supabase

## Aggiunta colonna creator_id

Per far funzionare il sistema di autenticazione Discord, è necessario aggiungere la colonna `creator_id` alla tabella `transcripts` nel database Supabase.

### SQL Migration

Esegui questo comando SQL nel tuo database Supabase (SQL Editor):

```sql
-- Aggiungi la colonna creator_id alla tabella transcripts
ALTER TABLE transcripts
ADD COLUMN IF NOT EXISTS creator_id VARCHAR(255);

-- Crea un indice per migliorare le performance delle query filtrate per creator_id
CREATE INDEX IF NOT EXISTS idx_transcripts_creator_id
ON transcripts(creator_id);

-- (Opzionale) Aggiungi un commento alla colonna per documentazione
COMMENT ON COLUMN transcripts.creator_id IS 'Discord User ID del creatore del transcript';
```

### Verifica

Dopo aver eseguito la migration, verifica che la colonna sia stata aggiunta correttamente:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'transcripts';
```

Dovresti vedere la colonna `creator_id` di tipo `character varying`.

### Schema finale della tabella transcripts

La tabella `transcripts` dovrebbe avere questa struttura:

| Colonna      | Tipo                     | Descrizione                                |
| ------------ | ------------------------ | ------------------------------------------ |
| id           | uuid (primary key)       | ID univoco del transcript                  |
| ticket_id    | varchar                  | ID del ticket                              |
| html_content | text                     | Contenuto HTML del transcript              |
| creator_id   | varchar                  | Discord User ID del creatore               |
| created_at   | timestamp with time zone | Data di creazione                          |
| updated_at   | timestamp with time zone | Data di ultimo aggiornamento (se presente) |

### Note importali

- La colonna `creator_id` conterrà l'ID Discord dell'utente che ha creato il transcript
- I transcript esistenti avranno `creator_id` NULL finché non verranno aggiornati
- Assicurati di passare il `creatorId` quando fai upload di nuovi transcript tramite l'API
