# Sonja van der Arend — website

De website van Sonja van der Arend: schrijfcoach en creatief onderzoeker. De homepage (`/`) toont vier
doelgroep-tegels (Schrijven voor Iedereen, Voor kinderen & scholen, Organisaties & Professionals, Vakgenoten).
Klik je op een tegel, dan groeit die (in Chrome/Edge, via de native View Transitions API) uit tot een
full-screen hero op de bijbehorende pagina, met daaronder het aanbod per doelgroep als tegelraster.
`over-sonja.html` en `contact.html` zijn losse, doorlopende pagina's.

Het "Kris Kras Clubhuis" (de verhalen-etalage voor kinderen) is een apart project en blijft in de repo
`verhalenwinkel` — de tegel "Voor kinderen & scholen" verwijst daar met een link naartoe.

## Starten

1. Installeer de dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.example` naar `.env` en pas eventueel het wachtwoord aan:

   ```bash
   cp .env.example .env
   ```

   Standaardwachtwoord voor de beheerder: `sonja123`.

3. Start de server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in je browser.

## Gebruik

- **Homepage** (`/`): de vier doelgroep-tegels.
- **Contact & Aanmelden** (`/contact.html`): één contactformulier met keuzeveld (schrijfclub/school/organisatie/
  overig).
- **Beheer** (`/login.html`): log in om binnengekomen contactaanvragen te bekijken en te verwijderen via
  `/admin.html`.

## Techniek

- **Backend**: Node.js + Express. Sessies via een ondertekende cookie (`cookie-session`), wachtwoordcontrole via
  `bcryptjs`.
- **Opslag**: lokaal in `data/contact.json` (geen database nodig). Op Netlify wordt automatisch overgeschakeld
  naar **Netlify Blobs**, omdat Netlify Functions geen bestanden op schijf kunnen bewaren tussen aanroepen.
- **Frontend**: losse HTML/CSS/JS-bestanden zonder build-stap. Typografie: Fraunces (koppen), Public Sans
  (lopende tekst), IBM Plex Mono (labels/metadata).

## Projectstructuur

```
server/               Express-app (routes, opslag)
  app.js               de Express-app zelf (gedeeld tussen lokaal en Netlify)
  index.js             lokale start (npm start): voegt statische bestanden toe + luistert
  contact.js           kiest automatisch lokale opslag of Netlify Blobs
  contact.local.js     opslag in data/contact.json
  contact.blobs.js     opslag via Netlify Blobs
netlify/functions/    Netlify Function die app.js hergebruikt (serverless-http)
netlify.toml          Netlify-configuratie (routing /api/* naar de function)
public/               Frontend (homepage, tegel-pagina's, contact, beheer)
data/                 Lokale opslag van contactaanvragen (niet in git, alleen voor npm start)
```

## Live zetten op Netlify

1. Log in op [app.netlify.com](https://app.netlify.com) en klik **"Add new site" →
   "Import an existing project"**.
2. Kies GitHub, en selecteer de repository `mlx-web/sonja_tegels`.
3. Netlify herkent de instellingen automatisch via `netlify.toml` (publish-map `public`,
   functions-map `netlify/functions`). Klik **"Deploy"**.
4. Ga na het deployen naar **Site settings → Environment variables** en voeg toe:
   - `ADMIN_PASSWORD` — een eigen, geheim wachtwoord (niet het standaardwachtwoord
     laten staan voor een publiek toegankelijke site!)
   - `SESSION_SECRET` — een willekeurige lange tekenreeks
5. Doe daarna nog een **"Trigger deploy"** zodat de nieuwe variabelen worden meegenomen.

Netlify Blobs hoeft nergens apart aangezet te worden — dat werkt automatisch zodra de site op Netlify draait.
