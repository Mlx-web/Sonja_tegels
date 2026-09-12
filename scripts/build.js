const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SEED_DIR = path.join(__dirname, '..', 'sanity', 'seed-data');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

async function fetchContent(pageName) {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  if (!projectId) {
    // Geen Sanity-project gekoppeld: gebruik de lokale seed-data.
    // Dit maakt het mogelijk om de build lokaal te testen voordat het
    // echte Sanity-project bestaat.
    const seedPath = path.join(SEED_DIR, `${pageName}.json`);
    if (!fs.existsSync(seedPath)) return null;
    return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  }

  const {createClient} = require('@sanity/client');
  const client = createClient({projectId, dataset, apiVersion: '2024-01-01', useCdn: true});
  return client.fetch(`*[_type == $type][0]`, {type: `${pageName}Page`});
}

// Kleuren horen bij de tegel van de pagina waar het kaartje vandaan komt
// (zie --tile-* in homepage.css), zodat een "Binnenkort"-kaartje er op de
// homepage hetzelfde uitziet als op zijn eigen pagina.
const TILE_COLOR = {
  'kinderen-en-scholen': 'var(--tile-kinderen)',
  'schrijven-voor-iedereen': 'var(--tile-schrijven)',
  'organisaties-en-professionals': 'var(--tile-organisaties)',
  vakgenoten: 'var(--tile-vakgenoten)',
};
const TILE_TEXT_COLOR = {
  'kinderen-en-scholen': 'var(--ink)',
  'schrijven-voor-iedereen': 'var(--ink)',
  'organisaties-en-professionals': '#fff',
  vakgenoten: '#fff',
};

function summarize(value) {
  if (Array.isArray(value)) return value.join(' ');
  return value || '';
}

function binnenkortItem(card, pageName, pageUrl, {summaryField = 'body', linkTextField = 'linkText'} = {}) {
  return {
    title: card.title,
    summary: summarize(card[summaryField]),
    linkText: card[linkTextField] || 'Meer info',
    linkUrl: card.linkUrl || pageUrl,
    color: TILE_COLOR[pageName],
    textColor: TILE_TEXT_COLOR[pageName],
  };
}

function collectFlaggedCards(cards, pageName, pageUrl) {
  return (cards || [])
    .filter((card) => card && card.binnenkort)
    .map((card) => binnenkortItem(card, pageName, pageUrl));
}

// Verzamelt alle kaartjes die op hun eigen pagina zijn aangevinkt met
// "Toon op homepage onder Binnenkort", over alle vier doelgroep-pagina's
// heen. Elke pagina heeft zijn eigen kaartjes-vorm (vaste kaartjes met
// eigen velden, plus een generieke extraCards-lijst), vandaar de
// per-pagina uitzonderingen hieronder.
async function getBinnenkortItems() {
  const items = [];

  const kinderen = await fetchContent('kinderen-en-scholen');
  if (kinderen) {
    items.push(...collectFlaggedCards(kinderen.cards, 'kinderen-en-scholen', 'kinderen-en-scholen.html'));
  }

  const schrijven = await fetchContent('schrijven-voor-iedereen');
  if (schrijven) {
    const pageUrl = 'schrijven-voor-iedereen.html';
    if (schrijven.schrijfclub && schrijven.schrijfclub.binnenkort) {
      items.push(binnenkortItem(schrijven.schrijfclub, 'schrijven-voor-iedereen', pageUrl, {summaryField: 'intro'}));
    }
    if (schrijven.waga && schrijven.waga.binnenkort) {
      items.push(binnenkortItem(schrijven.waga, 'schrijven-voor-iedereen', pageUrl, {summaryField: 'lines', linkTextField: 'ctaText'}));
    }
    if (schrijven.writeHere && schrijven.writeHere.binnenkort) {
      items.push(binnenkortItem(schrijven.writeHere, 'schrijven-voor-iedereen', pageUrl, {summaryField: 'intro'}));
    }
    if (schrijven.individueel && schrijven.individueel.binnenkort) {
      items.push(binnenkortItem(schrijven.individueel, 'schrijven-voor-iedereen', pageUrl, {summaryField: 'intro'}));
    }
    items.push(...collectFlaggedCards(schrijven.extraCards, 'schrijven-voor-iedereen', pageUrl));
  }

  const organisaties = await fetchContent('organisaties-en-professionals');
  if (organisaties) {
    const pageUrl = 'organisaties-en-professionals.html';
    for (const key of ['wur', 'huisarts', 'beleidsfeuilleton', 'andereIdeeen']) {
      const card = organisaties[key];
      if (card && card.binnenkort) {
        items.push(binnenkortItem(card, 'organisaties-en-professionals', pageUrl));
      }
    }
    if (organisaties.beleidsromans && organisaties.beleidsromans.binnenkort) {
      items.push(binnenkortItem(organisaties.beleidsromans, 'organisaties-en-professionals', pageUrl, {summaryField: 'intro'}));
    }
    items.push(...collectFlaggedCards(organisaties.extraCards, 'organisaties-en-professionals', pageUrl));
  }

  const vakgenoten = await fetchContent('vakgenoten');
  if (vakgenoten) {
    const pageUrl = 'vakgenoten.html';
    if (vakgenoten.workshops && vakgenoten.workshops.binnenkort) {
      items.push(binnenkortItem(vakgenoten.workshops, 'vakgenoten', pageUrl));
    }
    items.push(...collectFlaggedCards(vakgenoten.extraCards, 'vakgenoten', pageUrl));
  }

  return items;
}

async function buildPage(pageName) {
  const templatePath = path.join(TEMPLATES_DIR, `${pageName}.html`);
  if (!fs.existsSync(templatePath)) return;

  const content = await fetchContent(pageName);
  if (!content) {
    console.warn(`Geen inhoud gevonden voor ${pageName}, pagina overgeslagen.`);
    return;
  }

  if (pageName === 'index') {
    content.binnenkort = await getBinnenkortItems();
  }

  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource, {noEscape: false});
  const html = template(content);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${pageName}.html`), html);
  console.log(`Gebouwd: ${pageName}.html`);
}

async function main() {
  const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter((f) => f.endsWith('.html'));
  const pageNames = templateFiles.map((f) => f.replace(/\.html$/, ''));

  for (const pageName of pageNames) {
    await buildPage(pageName);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
