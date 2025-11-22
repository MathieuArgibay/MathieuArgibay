// portfolio_video.js

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".video-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Activer le bouton
      filterButtons.forEach((btn) =>
        btn.classList.remove("filter-btn--active")
      );
      button.classList.add("filter-btn--active");

      // Filtrage
      cards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || filter === category) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
});

// ===== MODAL VIDEO =====

const modal = document.getElementById("video-modal");
const iframe = document.getElementById("video-modal-iframe");
const closeBtn = document.querySelector(".video-modal-close");

document.querySelectorAll(".open-video").forEach((btn) => {
  btn.addEventListener("click", () => {
    const videoURL = btn.getAttribute("data-video") + "?autoplay=1";
    iframe.src = videoURL;
    modal.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  iframe.src = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    iframe.src = "";
  }
});
