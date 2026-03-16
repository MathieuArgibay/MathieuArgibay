(function () {
  let emailJsInitialized = false;

  function initEmailJsOnce() {
    if (emailJsInitialized) return;
    if (typeof window.emailjs === "undefined") {
      console.warn("EmailJS n'est pas chargé.");
      return;
    }

    window.emailjs.init("w-BEFMqJhqCDsKvY2");
    emailJsInitialized = true;
  }

  function getRecaptchaResponse(captchaElement) {
    if (typeof window.grecaptcha === "undefined" || !captchaElement) {
      return "";
    }

    const widgetId = captchaElement.dataset.widgetId;
    if (widgetId === undefined) return "";

    try {
      return window.grecaptcha.getResponse(Number(widgetId));
    } catch (error) {
      console.error("Erreur lecture reCAPTCHA :", error);
      return "";
    }
  }

  function resetRecaptcha(captchaElement) {
    if (typeof window.grecaptcha === "undefined" || !captchaElement) return;

    const widgetId = captchaElement.dataset.widgetId;
    if (widgetId === undefined) return;

    try {
      window.grecaptcha.reset(Number(widgetId));
    } catch (error) {
      console.error("Erreur reset reCAPTCHA :", error);
    }
  }

  function showLoader(form) {
    const section = form.closest(".contact-block");
    const loader =
      section?.parentElement?.querySelector("[data-contact-loader]") ||
      document.querySelector("[data-contact-loader]");
    if (loader) {
      loader.style.display = "flex";
    }
  }

  function hideLoader(form) {
    const section = form.closest(".contact-block");
    const loader =
      section?.parentElement?.querySelector("[data-contact-loader]") ||
      document.querySelector("[data-contact-loader]");
    if (loader) {
      loader.style.display = "none";
    }
  }

  function setFormMessage(form, text, type = "info") {
    const section = form.closest(".contact-block");
    const message = section?.querySelector("[data-contact-message]");
    if (!message) return;

    message.textContent = text;

    if (type === "success") {
      message.style.color = "green";
      return;
    }

    if (type === "error") {
      message.style.color = "red";
      return;
    }

    message.style.color = "";
  }

  function sendAutoResponse(userName, userEmail) {
    if (!userEmail || !userName) {
      return Promise.reject(
        new Error("Données manquantes pour la réponse automatique."),
      );
    }

    const params = {
      user_name: userName,
      user_email: userEmail,
    };

    return window.emailjs.send("service_1cjyzga", "template_u8y4np8", params);
  }

  function bindContactForm(form) {
    if (!form || form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      initEmailJsOnce();

      if (typeof window.emailjs === "undefined") {
        setFormMessage(
          form,
          "Le service d’envoi est indisponible pour le moment.",
          "error",
        );
        return;
      }

      const captchaElement = form.querySelector(".g-recaptcha");
      const recaptchaResponse = getRecaptchaResponse(captchaElement);

      if (!recaptchaResponse) {
        setFormMessage(form, "Merci de vérifier le reCAPTCHA.", "error");
        return;
      }

      const emailInput = form.querySelector("input[name='email']");
      const nameInput = form.querySelector("input[name='name']");
      const userEmail = emailInput?.value?.trim() || "";
      const userName = nameInput?.value?.trim() || "";

      try {
        showLoader(form);
        setFormMessage(form, "");

        await window.emailjs.sendForm(
          "service_1cjyzga",
          "template_cgjz1bk",
          form,
        );

        try {
          await sendAutoResponse(userName, userEmail);
        } catch (autoResponseError) {
          console.warn("Réponse automatique non envoyée :", autoResponseError);
        }

        setFormMessage(form, "Message envoyé avec succès !", "success");
        form.reset();
        resetRecaptcha(captchaElement);

        window.location.href = "/confirmation.html";
      } catch (error) {
        console.error("Erreur envoi formulaire :", error);
        setFormMessage(
          form,
          "Erreur lors de l'envoi. Veuillez réessayer.",
          "error",
        );
      } finally {
        hideLoader(form);
      }
    });
  }

  function initContactForms() {
    const forms = document.querySelectorAll("[data-contact-form]");
    forms.forEach(bindContactForm);
  }

  window.initContactForms = initContactForms;
})();
