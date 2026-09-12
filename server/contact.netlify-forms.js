const NETLIFY_API = 'https://api.netlify.com/api/v1';

function siteId() {
  return process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
}

async function apiFetch(path, options = {}) {
  const token = process.env.NETLIFY_API_TOKEN;
  if (!token) {
    throw new Error('NETLIFY_API_TOKEN ontbreekt.');
  }
  const res = await fetch(`${NETLIFY_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Netlify API-fout (${res.status}): ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

function toMessage(submission) {
  const data = submission.data || {};
  return {
    id: submission.id,
    name: data.name || '',
    email: data.email || '',
    category: data.category || '',
    text: data.text || '',
    createdAt: submission.created_at,
  };
}

async function getAllMessages() {
  const site = siteId();
  if (!site) {
    throw new Error('NETLIFY_SITE_ID (of SITE_ID) ontbreekt.');
  }
  const submissions = await apiFetch(`/sites/${site}/submissions`);
  return submissions
    .map(toMessage)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function deleteMessage(id) {
  await apiFetch(`/submissions/${id}`, { method: 'DELETE' });
  return true;
}

module.exports = { getAllMessages, deleteMessage };
