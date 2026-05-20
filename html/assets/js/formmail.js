const form = document.getElementById("contact-form");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupClose = document.getElementById("popup-close");

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
  // wait for transition
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

function hidePopup() {
  popup.classList.remove("show");
  // wait for transition
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 300);
}

function getMessage(key) {
  const isGerman = document.documentElement.lang === "de";
  const messages = {
    success: {
      de: "Formular erfolgreich gesendet!",
      en: "Message sent successfully!"
    },
    error: {
      de: "Es gab einen Fehler beim Senden des Formulars. Bitte versuche es erneut.",
      en: "Something went wrong while sending the form. Please try again."
    }
  };

  return messages[key][isGerman ? "de" : "en"];
}

popupClose.addEventListener("click", hidePopup);
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    hidePopup();
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // get data from the form
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Send the form data using fetch
  fetch("https://api.gustavotzen.de/mail/send/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      email_client: email,
      message: message
    })
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Success:", data);
      showPopup(getMessage("success"));
      form.reset();
    })
    .catch((error) => {
      console.error("Form submission failed:", error);
      showPopup(getMessage("error"));
    });
});
