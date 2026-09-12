require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {createClient} = require('@sanity/client');

const SEED_DIR = path.join(__dirname, '..', 'sanity', 'seed-data');

async function main() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    console.error('SANITY_PROJECT_ID en SANITY_API_TOKEN zijn verplicht (zie .env).');
    process.exit(1);
  }

  const client = createClient({projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false});

  const files = fs.readdirSync(SEED_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const pageName = file.replace(/\.json$/, '');
    const type = `${pageName}Page`;
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, file), 'utf8'));
    const doc = {_id: type, _type: type, ...data};
    await client.createOrReplace(doc);
    console.log(`Geïmporteerd: ${type}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
