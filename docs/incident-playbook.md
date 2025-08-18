# Incident & Recovery Plan

## 1. Notifica emergenza
- Cosa fare quando ricevi un alert Slack/Email Sentry
- Canali (#EMiTR) e persone da contattare in caso di errori bloccanti

## 2. Procedure di rollback/restore
- Comando rapido per ripristino DB:  
  `mysql -u root -p tododb < backup.sql`
- Comando git per rollback codice:  
  `git checkout NOME_TAG_STABILE`
  oppure  
  `git revert SHA`
- Link diretto ai backup su cloud o server

## 3. Lista ruoli/turni di reperibilità
- Chi è “on-call”? A chi tocca rispondere/notificare?

## 4. Checklist post-incidente
- Documentare intervento preso
- Creare issue di miglioramento per evitare recidive
- Avvisare clienti/interessati se necessario
