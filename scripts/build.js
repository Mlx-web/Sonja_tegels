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

async function buildPage(pageName) {
  const templatePath = path.join(TEMPLATES_DIR, `${pageName}.html`);
  if (!fs.existsSync(templatePath)) return;

  const content = await fetchContent(pageName);
  if (!content) {
    console.warn(`Geen inhoud gevonden voor ${pageName}, pagina overgeslagen.`);
    return;
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
