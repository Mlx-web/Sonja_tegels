const contactForm = document.getElementById('contact-form');
const contactNote = document.getElementById('contact-note');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactNote.hidden = true;

  const formData = new URLSearchParams(new FormData(contactForm)).toString();

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Versturen mislukt.');
    }

    contactForm.reset();
    contactNote.className = 'contact-note success';
    contactNote.textContent = 'Bedankt, je bericht is verstuurd. Sonja neemt zo snel mogelijk contact op.';
    contactNote.hidden = false;
  } catch (err) {
    contactNote.className = 'contact-note error';
    contactNote.textContent = 'Er ging iets mis. Probeer het opnieuw.';
    contactNote.hidden = false;
  }
});
