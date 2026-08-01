"use strict";

const form = document.getElementById("contact-form");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupClose = document.getElementById("popup-close");

if (!(form instanceof HTMLFormElement)) {
  throw new Error("Contact form is missing or has an invalid type.");
}
if (!(popup instanceof HTMLElement) || !(popupMessage instanceof HTMLElement)) {
  throw new Error("Contact form feedback elements are missing.");
}
if (!(popupClose instanceof HTMLButtonElement)) {
  throw new Error("Contact form feedback close button is missing.");
}

const submitButton = form.querySelector('input[type="submit"]');
if (!(submitButton instanceof HTMLInputElement)) {
  throw new Error("Contact form submit button is missing.");
}

/** Show a localized result without inserting untrusted HTML. */
function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
  window.setTimeout(() => popup.classList.add("show"), 10);
}

/** Hide the result after the existing CSS transition completes. */
function hidePopup() {
  popup.classList.remove("show");
  window.setTimeout(() => popup.classList.add("hidden"), 300);
}

/** Return the localized message for a known submission outcome. */
function getMessage(key) {
  const isGerman = document.documentElement.lang === "de";
  const messages = {
    success: {
      de: "Formular erfolgreich gesendet!",
      en: "Message sent successfully!",
    },
    error: {
      de: "Es gab einen Fehler beim Senden des Formulars. Bitte versuche es erneut.",
      en: "Something went wrong while sending the form. Please try again.",
    },
  };

  if (!(key in messages)) {
    throw new Error(`Unknown contact form message key: ${key}`);
  }
  return messages[key][isGerman ? "de" : "en"];
}

/** Read and validate a required form control by ID. */
function getRequiredValue(id) {
  const control = document.getElementById(id);
  if (!(control instanceof HTMLInputElement) && !(control instanceof HTMLTextAreaElement)) {
    throw new Error(`Required contact form control is missing: ${id}`);
  }
  const value = control.value.trim();
  if (value.length === 0) {
    throw new Error(`Required contact form value is empty: ${id}`);
  }
  return value;
}

popupClose.addEventListener("click", hidePopup);
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    hidePopup();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  submitButton.disabled = true;
  try {
    const response = await fetch("https://api.gustavotzen.de/mail/send/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: getRequiredValue("name"),
        email_client: getRequiredValue("email"),
        message: getRequiredValue("message"),
      }),
    });

    if (!response.ok) {
      throw new Error(`Contact API returned HTTP ${response.status}.`);
    }

    showPopup(getMessage("success"));
    form.reset();
  } catch (error) {
    console.error("Contact form submission failed.", error);
    showPopup(getMessage("error"));
  } finally {
    submitButton.disabled = false;
  }
});
