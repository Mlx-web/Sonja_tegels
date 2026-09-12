require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {createClient} = require('@sanity/client');

const SEED_DIR = path.join(__dirname, '..', 'sanity', 'seed-data');

// Sanity vereist dat elk object in een array-veld een unieke `_key` heeft,
// anders kan de Studio de lijst niet bewerken ("Missing keys").
function addKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const withKeys = addKeys(item);
      if (withKeys && typeof withKeys === 'object' && !Array.isArray(withKeys)) {
        return {_key: crypto.randomUUID(), ...withKeys};
      }
      return withKeys;
    });
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = addKeys(val);
    }
    return result;
  }
  return value;
}

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
    const data = addKeys(JSON.parse(fs.readFileSync(path.join(SEED_DIR, file), 'utf8')));
    const doc = {_id: type, _type: type, ...data};
    await client.createOrReplace(doc);
    console.log(`Geïmporteerd: ${type}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
