document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.querySelector("[data-footer]");

  if (footerContainer) {
    fetch("/components/footer/footer.html")
      .then((response) => response.text())
      .then((html) => {
        footerContainer.innerHTML = html;

        const footerStyle = document.createElement("link");
        footerStyle.rel = "stylesheet";
        footerStyle.href = "/components/footer/footer.css";
        document.head.appendChild(footerStyle);
      })
      .catch((err) => console.error("Erreur chargement footer:", err));
  }
});
