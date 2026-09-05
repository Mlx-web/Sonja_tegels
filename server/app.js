require('dotenv').config();

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const contact = require('./contact');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sonja123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ontwikkel-geheime-sleutel';

// Wachtwoord-hash wordt eenmalig bij opstarten berekend, zodat we nooit
// het platte wachtwoord vergelijken.
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 4, // 4 uur
    httpOnly: true,
    sameSite: 'lax',
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Niet ingelogd.' });
}

// Vangt fouten in async route-handlers op en geeft ze door aan Express'
// foutafhandeling, in plaats van dat ze de hele functie laten crashen.
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// ---- Auth routes ----

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Onjuist wachtwoord.' });
  }
  req.session.isAdmin = true;
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

app.get('/api/session', (req, res) => {
  res.json({ isAdmin: Boolean(req.session && req.session.isAdmin) });
});

// ---- Contactformulier: Aanmelden & Contact ----
// Iedereen mag een aanvraag insturen zonder in te loggen; alleen de
// beheerder kan de binnengekomen aanvragen lezen.

const CONTACT_CATEGORIES = ['schrijfclub', 'school', 'organisatie', 'overig'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', asyncHandler(async (req, res) => {
  const { name, email, category, text } = req.body || {};
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Vul je naam in.' });
  }
  if (!email || !EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }
  if (!CONTACT_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Kies waar je bericht over gaat.' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Vul een bericht in.' });
  }

  const message = await contact.addMessage({
    name: name.trim().slice(0, 80),
    email: email.trim().slice(0, 200),
    category,
    text: text.trim().slice(0, 2000),
  });
  res.status(201).json({ ok: true, id: message.id });
}));

app.get('/api/contact', requireAuth, asyncHandler(async (req, res) => {
  res.json(await contact.getAllMessages());
}));

app.delete('/api/contact/:id', requireAuth, asyncHandler(async (req, res) => {
  const removed = await contact.deleteMessage(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Bericht niet gevonden.' });
  res.json({ ok: true });
}));

// Algemene foutafhandeling: onverwachte fouten komen hier terecht in
// plaats van dat de hele functie crasht.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Er ging iets mis op de server.' });
});

module.exports = app;
