const logoutBtn = document.getElementById('logout-btn');
const contactList = document.getElementById('contact-manage-list');
const contactEmptyNote = document.getElementById('contact-empty-note');

async function requireSession() {
  const res = await fetch('/api/session');
  const data = await res.json();
  if (!data.isAdmin) {
    window.location.href = 'login.html';
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const CONTACT_CATEGORY_LABELS = {
  schrijfclub: 'Schrijfclub / inloopsessie',
  school: 'School',
  organisatie: 'Organisatie',
  vakgenoten: 'Vakgenoten',
  overig: 'Overig',
};

async function loadContact() {
  const res = await fetch('/api/contact');
  if (!res.ok) return;
  const messages = await res.json();

  contactList.innerHTML = '';
  contactEmptyNote.hidden = messages.length > 0;

  messages.forEach((message) => {
    const li = document.createElement('li');

    const info = document.createElement('span');
    const titleEl = document.createElement('span');
    titleEl.className = 'contact-manage-title';
    titleEl.textContent = message.name;
    const metaEl = document.createElement('span');
    metaEl.className = 'contact-manage-meta';
    const categoryLabel = CONTACT_CATEGORY_LABELS[message.category] || message.category;
    metaEl.textContent = `${message.email} — ${categoryLabel} — ${formatDate(message.createdAt)}`;
    const textEl = document.createElement('span');
    textEl.className = 'contact-manage-text';
    textEl.textContent = message.text;
    info.appendChild(titleEl);
    info.appendChild(metaEl);
    info.appendChild(textEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Verwijderen';
    deleteBtn.addEventListener('click', () => deleteContactMessage(message.id));

    li.appendChild(info);
    li.appendChild(deleteBtn);
    contactList.appendChild(li);
  });
}

async function deleteContactMessage(id) {
  if (!confirm('Deze aanvraag verwijderen?')) return;
  const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadContact();
  }
}

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = 'index.html';
});

requireSession();
loadContact();
