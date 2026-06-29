# Deploy MELI su Vercel

Guida per pubblicare l'app React/Vite **MELI** su [Vercel](https://vercel.com).

## Prerequisiti

- Account [Vercel](https://vercel.com/signup)
- Repository Git (GitHub, GitLab o Bitbucket) con il codice del progetto
- Node.js 20+ in locale (per verificare la build)

## Verifica locale (consigliata)

```bash
npm ci
npm run build
npm run preview
```

Apri `http://localhost:4173` e verifica:

- Home e routing (`/apiari`, `/arnie`, `/demo`, ecc.)
- Refresh su URL profonde (es. `/arnie/xxx`) — deve funzionare come in produzione
- Favicon e icona installabile (PWA)

## Opzione A — Deploy da dashboard Vercel

1. Vai su [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → seleziona il repo MELI
3. Vercel rileva automaticamente **Vite**; conferma:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci` (o `npm install`)
4. Aggiungi le variabili d'ambiente (vedi sotto)
5. Clic **Deploy**

## Opzione B — Deploy da CLI

```bash
npm i -g vercel
vercel login
vercel          # primo deploy (preview)
vercel --prod   # deploy produzione
```

La CLI legge `vercel.json` già presente nel repo.

## Configurazione progetto

Il repository include già:

| File | Scopo |
|------|--------|
| `vercel.json` | Build, output `dist`, rewrite SPA, cache asset |
| `vite.config.ts` | Build ottimizzata, chunk vendor, PWA |
| `public/manifest.webmanifest` | Manifest PWA |
| `.env.example` | Template variabili ambiente |

### Routing SPA

L'app usa `BrowserRouter`. Tutte le route client-side (`/apiari`, `/arnie/:id/visita`, `/demo/...`) sono reindirizzate a `index.html` tramite rewrite in `vercel.json`.

### PWA

- Service worker generato da `vite-plugin-pwa` in build
- Registrazione automatica in produzione (`src/pwa/registerPwa.ts`)
- Icone: `public/meli-icon.svg`, `public/favicon.svg`

Per test PWA in locale dopo build:

```bash
npm run build && npm run preview
```

## Variabili d'ambiente

Configura in **Vercel → Project → Settings → Environment Variables**:

| Variabile | Ambiente | Valore consigliato | Descrizione |
|-----------|----------|-------------------|-------------|
| `VITE_DEMO_SEED` | Production | *(vuoto o `false`)* | Non popolare dati demo nel DB reale |
| `VITE_DEMO_SEED` | Preview / Development | `false` | Idem; usa **Modalità Demo** (`/demo`) per dati dimostrativi |

Copia `.env.example` in `.env.local` per lo sviluppo:

```bash
cp .env.example .env.local
```

> **Nota:** le variabili Vite devono iniziare con `VITE_` per essere esposte al client.

## Dopo il deploy

1. Apri l'URL assegnato da Vercel (es. `https://meli-xxx.vercel.app`)
2. Completa l'onboarding (primo apiario + arnia) **oppure** usa **🚧 Demo** dal menu
3. Su iPad/iPhone: **Aggiungi a Home** per installare la PWA

## Dominio personalizzato

1. Vercel → Project → **Settings → Domains**
2. Aggiungi il dominio (es. `meli.tuodominio.it`)
3. Configura i record DNS indicati da Vercel

## Risoluzione problemi

| Problema | Soluzione |
|----------|-----------|
| 404 su refresh di route profonde | Verifica che `vercel.json` sia nel repo e contenga i rewrite SPA |
| Build fallita | Esegui `npm run build` in locale e correggi errori TypeScript |
| PWA non si aggiorna | Hard refresh o chiudi/riapri la PWA; il SW usa `autoUpdate` |
| Dati demo nel DB reale | Non impostare `VITE_DEMO_SEED=true` in produzione |

## CI consigliata

Ogni push su `main` può attivare deploy automatico se abiliti **Production Branch** in Vercel. Le Pull Request generano **Preview Deployment** con URL dedicato — utile per review del Product Owner.

---

**Stack:** React 19 · Vite 8 · Dexie (IndexedDB) · Vercel Static + SPA
