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
  await loadComponent("header", "/components/header.html");
  await loadComponent("footer", "/components/footer.html");
});
