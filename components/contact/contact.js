async function injectContactComponent() {
  const targets = document.querySelectorAll("[data-contact]");
  if (!targets.length) return;

  try {
    loadContactStylesOnce("/components/contact/contact.css");

    const response = await fetch("/components/contact/contact.html");
    if (!response.ok) {
      throw new Error("Impossible de charger le composant contact.");
    }

    const html = await response.text();

    targets.forEach((target) => {
      target.innerHTML = html;
    });

    if (typeof window.initContactForms === "function") {
      window.initContactForms();
    }

    if (typeof window.grecaptcha !== "undefined") {
      renderRecaptchas();
    } else {
      waitForRecaptchaAndRender();
    }
  } catch (error) {
    console.error("Erreur injection composant contact :", error);
  }
}

function loadContactStylesOnce(href) {
  const existingLink = document.querySelector(
    `link[data-contact-style="${href}"]`,
  );
  if (existingLink) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-contact-style", href);
  document.head.appendChild(link);
}

function renderRecaptchas() {
  const captchas = document.querySelectorAll(
    ".g-recaptcha:not([data-rendered='true'])",
  );

  captchas.forEach((captcha) => {
    const sitekey = captcha.dataset.sitekey;
    if (!sitekey) return;

    try {
      const widgetId = window.grecaptcha.render(captcha, {
        sitekey: sitekey,
      });

      captcha.dataset.widgetId = String(widgetId);
      captcha.dataset.rendered = "true";
    } catch (error) {
      console.error("Erreur render reCAPTCHA :", error);
    }
  });
}

function waitForRecaptchaAndRender() {
  let attempts = 0;
  const maxAttempts = 40;

  const interval = setInterval(() => {
    attempts += 1;

    if (typeof window.grecaptcha !== "undefined") {
      renderRecaptchas();
      clearInterval(interval);
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn("reCAPTCHA non disponible après attente.");
    }
  }, 250);
}

document.addEventListener("DOMContentLoaded", injectContactComponent);
