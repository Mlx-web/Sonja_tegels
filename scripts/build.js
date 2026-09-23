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

// Kleuren horen bij de tegel van de doelgroep (zie --tile-* in
// homepage.css), zodat een "Binnenkort"-kaartje er hetzelfde uitziet als
// de pagina waar het bij hoort.
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
const PAGE_URL = {
  'kinderen-en-scholen': 'kinderen-en-scholen.html',
  'schrijven-voor-iedereen': 'schrijven-voor-iedereen.html',
  'organisaties-en-professionals': 'organisaties-en-professionals.html',
  vakgenoten: 'vakgenoten.html',
};

function summarize(value) {
  if (Array.isArray(value)) return value.join(' ');
  return value || '';
}

// Voor de vaste, aan een pagina gebonden kaartjes (bv. Waga Write Club) die
// zelf zijn aangevinkt met "Toon ook op de homepage onder Binnenkort".
function binnenkortItem(card, pageName, {summaryField = 'body', linkTextField = 'linkText'} = {}) {
  const pageUrl = PAGE_URL[pageName];
  return {
    title: card.title,
    summary: summarize(card[summaryField]),
    linkText: card[linkTextField] || 'Meer info',
    linkUrl: card.linkUrl || pageUrl,
    color: TILE_COLOR[pageName],
    textColor: TILE_TEXT_COLOR[pageName],
  };
}

// Voor kaartjes die rechtstreeks op de homepage zijn aangemaakt (met een
// gekozen doelgroep) — dit is de belangrijkste bron van "Binnenkort".
function homepageBinnenkortItem(item) {
  const pageName = item.doelgroep;
  const pageUrl = PAGE_URL[pageName];
  return {
    title: item.title,
    summary: summarize(item.body),
    linkText: item.linkText || 'Meer info',
    linkUrl: item.linkUrl || pageUrl,
    color: TILE_COLOR[pageName],
    textColor: TILE_TEXT_COLOR[pageName],
  };
}

// Verzamelt alle "Binnenkort"-kaartjes: zowel de vaste pagina-kaartjes die
// zichzelf hebben aangevinkt, als de kaartjes die rechtstreeks op de
// homepage zijn aangemaakt. Kaartjes met dezelfde doelgroep (kleur) staan
// zoveel mogelijk bij elkaar.
async function getBinnenkortItems(indexContent) {
  const items = [];

  const schrijven = await fetchContent('schrijven-voor-iedereen');
  if (schrijven) {
    if (schrijven.schrijfclub && schrijven.schrijfclub.binnenkort) {
      items.push(binnenkortItem(schrijven.schrijfclub, 'schrijven-voor-iedereen', {summaryField: 'intro'}));
    }
    if (schrijven.waga && schrijven.waga.binnenkort) {
      items.push(binnenkortItem(schrijven.waga, 'schrijven-voor-iedereen', {summaryField: 'lines', linkTextField: 'ctaText'}));
    }
    if (schrijven.writeHere && schrijven.writeHere.binnenkort) {
      items.push(binnenkortItem(schrijven.writeHere, 'schrijven-voor-iedereen', {summaryField: 'intro'}));
    }
    if (schrijven.individueel && schrijven.individueel.binnenkort) {
      items.push(binnenkortItem(schrijven.individueel, 'schrijven-voor-iedereen', {summaryField: 'intro'}));
    }
  }

  const organisaties = await fetchContent('organisaties-en-professionals');
  if (organisaties) {
    for (const key of ['wur', 'huisarts', 'beleidsfeuilleton', 'andereIdeeen']) {
      const card = organisaties[key];
      if (card && card.binnenkort) {
        items.push(binnenkortItem(card, 'organisaties-en-professionals'));
      }
    }
    if (organisaties.beleidsromans && organisaties.beleidsromans.binnenkort) {
      items.push(binnenkortItem(organisaties.beleidsromans, 'organisaties-en-professionals', {summaryField: 'intro'}));
    }
  }

  const vakgenoten = await fetchContent('vakgenoten');
  if (vakgenoten && vakgenoten.workshops && vakgenoten.workshops.binnenkort) {
    items.push(binnenkortItem(vakgenoten.workshops, 'vakgenoten'));
  }

  for (const item of (indexContent && indexContent.binnenkort) || []) {
    items.push(homepageBinnenkortItem(item));
  }

  // Zelfde doelgroep (kleur) liever naast elkaar in het rooster.
  items.sort((a, b) => (a.color || '').localeCompare(b.color || ''));

  return items;
}

// Kaartjes die op de homepage zijn aangemaakt met doelgroep `pageName`
// verschijnen ook automatisch als kaartje op die doelgroep-pagina zelf.
async function withHomepageBinnenkort(content, pageName) {
  const index = await fetchContent('index');
  const extra = ((index && index.binnenkort) || [])
    .filter((item) => item.doelgroep === pageName)
    .map((item) => ({title: item.title, body: item.body, linkText: item.linkText, linkUrl: item.linkUrl}));

  if (!extra.length) return content;

  if (pageName === 'kinderen-en-scholen') {
    content.cards = [...(content.cards || []), ...extra];
  } else {
    content.extraCards = [...(content.extraCards || []), ...extra];
  }
  return content;
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
    content.binnenkort = await getBinnenkortItems(content);
  } else if (PAGE_URL[pageName]) {
    await withHomepageBinnenkort(content, pageName);
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
