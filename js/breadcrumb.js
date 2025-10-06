document.addEventListener("DOMContentLoaded", () => {
  const crumb = document.getElementById("current-project");
  if (crumb) {
    const title = document.querySelector("h2")?.innerText || "Projet";
    crumb.textContent = title;
  }
});
