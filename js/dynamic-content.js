// Dynamically load header and footer
document.addEventListener("DOMContentLoaded", async () => {
  async function loadComponent(id, filePath) {
    const el = document.getElementById(id);
    if (el) {
      const response = await fetch(filePath);
      const html = await response.text();
      el.innerHTML = html;
    }
  }

  // Charger header et footer
  await loadComponent("header", "/components/header.html");
  await loadComponent("footer", "/components/footer.html");

  // === Auto-hide header ===
  const header = document.querySelector("header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
      // tout en haut → header visible
      header.classList.remove("hidden");
    } else if (currentScroll > lastScroll) {
      // on descend → cacher
      header.classList.add("hidden");
    } else {
      // on remonte → montrer
      header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  });

  // Si la souris touche le haut de la fenêtre → montrer le header
  document.addEventListener("mousemove", (e) => {
    if (e.clientY < 50) {
      header.classList.remove("hidden");
    }
  });
});
