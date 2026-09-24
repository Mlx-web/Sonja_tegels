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

// Homepage-kaartjes tonen alleen de eerste zin (voor een kort, compact
// kaartje) — de volledige tekst staat al op de doelgroep-pagina zelf, één
// klik verderop via de "Meer info"-link.
function firstSentence(value) {
  const text = summarize(value).trim();
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}

// Voor de vaste, aan een pagina gebonden kaartjes (bv. Waga Write Club) die
// zelf zijn aangevinkt met "Toon ook op de homepage onder Binnenkort". Het
// homepage-kaartje linkt altijd naar de eigen doelgroep-pagina (waar de
// volledige tekst en de eigenlijke link, bv. naar het aanmeldformulier,
// wél staan) — niet naar de linkUrl van het kaartje zelf.
function binnenkortItem(card, pageName, {summaryField = 'body'} = {}) {
  const pageUrl = PAGE_URL[pageName];
  return {
    title: card.title,
    summary: firstSentence(card[summaryField]),
    linkText: 'Meer info',
    linkUrl: pageUrl,
    color: TILE_COLOR[pageName],
    textColor: TILE_TEXT_COLOR[pageName],
    doelgroep: pageName,
  };
}

// Voor kaartjes die rechtstreeks op de homepage zijn aangemaakt (met een
// gekozen doelgroep) — dit is de belangrijkste bron van "Binnenkort".
function homepageBinnenkortItem(item) {
  const pageName = item.doelgroep;
  const pageUrl = PAGE_URL[pageName];
  return {
    title: item.title,
    datum: item.datum || '',
    summary: firstSentence(item.body),
    linkText: 'Meer info',
    linkUrl: pageUrl,
    color: TILE_COLOR[pageName],
    textColor: TILE_TEXT_COLOR[pageName],
    doelgroep: pageName,
  };
}

// Verzamelt alle "Binnenkort"-kaartjes: zowel de vaste pagina-kaartjes die
// zichzelf hebben aangevinkt, als de kaartjes die rechtstreeks op de
// homepage zijn aangemaakt.
async function getBinnenkortItems(indexContent) {
  const items = [];

  const schrijven = await fetchContent('schrijven-voor-iedereen');
  if (schrijven) {
    if (schrijven.schrijfclub && schrijven.schrijfclub.binnenkort) {
      items.push(binnenkortItem(schrijven.schrijfclub, 'schrijven-voor-iedereen', {summaryField: 'intro'}));
    }
    if (schrijven.waga && schrijven.waga.binnenkort) {
      items.push(binnenkortItem(schrijven.waga, 'schrijven-voor-iedereen', {summaryField: 'lines'}));
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

  return items;
}

// Groepeert de "Binnenkort"-kaartjes per doelgroep, zodat de homepage-
// template ze direct naast de bijbehorende tegel kan tonen (tileX.items).
function groupByDoelgroep(items) {
  const byDoelgroep = {};
  for (const pageName of Object.keys(PAGE_URL)) {
    byDoelgroep[pageName] = [];
  }
  for (const item of items) {
    if (byDoelgroep[item.doelgroep]) byDoelgroep[item.doelgroep].push(item);
  }
  return byDoelgroep;
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
    content.cards = [...extra, ...(content.cards || [])];
  } else {
    content.extraCards = [...extra, ...(content.extraCards || [])];
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
    const byDoelgroep = groupByDoelgroep(await getBinnenkortItems(content));
    content.tileSchrijven.items = byDoelgroep['schrijven-voor-iedereen'];
    content.tileKinderen.items = byDoelgroep['kinderen-en-scholen'];
    content.tileOrganisaties.items = byDoelgroep['organisaties-en-professionals'];
    content.tileVakgenoten.items = byDoelgroep.vakgenoten;
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
