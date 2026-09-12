# Openstaande actiepunten

## Sanity-abonnement terugzetten naar Free
Het Sanity-project is aangemaakt op een "Growth Trial" (proefperiode van het
betaalde Growth-abonnement), niet automatisch op het gratis Free-plan. Voor
deze website is het gratis plan ruim voldoende.

Actie: zodra de proefperiode afloopt (meestal 30 dagen na aanmaken, check de
exacte datum op sanity.io/manage onder het project), terugschakelen naar
Free. Anders gaat het abonnement ongemerkt over naar een betaald plan.

## E-mailadres voor het contactformulier instellen
Het contactformulier op contact.html gebruikt Netlify Forms. Berichten komen
in het Netlify-dashboard binnen, maar Sonja krijgt alleen een e-mail bij een
nieuw bericht als daar een notificatie-e-mailadres voor is ingesteld.

Actie: in Netlify, bij het project "sonjavanderarend": Site configuration →
Forms → Form notifications → "Add notification" → "Email notification" →
vul het e-mailadres in waar Sonja de berichten wil ontvangen.

## Netlify-token instellen voor de berichtenpagina
De "Berichten"-knop in de footer (login.html) toont binnengekomen
contactaanvragen via Netlify's eigen Forms-API. Daarvoor is een toegangstoken
nodig; zonder token blijft de pagina leeg of geeft een foutmelding.

Actie:
1. Ga naar Netlify → rechtsboven op je profielfoto → User settings →
   Applications → Personal access tokens → "New access token". Naam
   bijvoorbeeld "berichten-pagina", kopiëren.
2. Zet die token als omgevingsvariabele `NETLIFY_API_TOKEN` bij het project
   "sonjavanderarend" in Netlify: Site configuration → Environment variables
   → Add a variable.
3. `NETLIFY_SITE_ID` hoeft niet apart ingesteld te worden: Netlify vult dat
   voor Functions automatisch zelf in.
