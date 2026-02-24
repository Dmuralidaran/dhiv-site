// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav__toggle");
const list = document.querySelector(".nav__list");

if (toggle && list) {
  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (mobile)
  list.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Checklist form (front-end only demo)
const checklistForm = document.getElementById("checklistForm");
const formNote = document.getElementById("formNote");

if (checklistForm) {
  checklistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = new FormData(checklistForm).get("email");

    // This is a placeholder. For real email capture, connect Mailchimp/Brevo/Formspree.
    formNote.textContent = `Thanks! If this were connected, we’d email the checklist to ${email}.`;
    checklistForm.reset();
  });
}

// Contact form (front-end only demo)
const contactForm = document.getElementById("contactForm");
const contactNote = document.getElementById("contactNote");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Placeholder—connect to Formspree / Brevo / Netlify Forms for real submissions.
    contactNote.textContent = "Message sent (demo). Connect a form backend to receive emails.";
    contactForm.reset();
  });
}