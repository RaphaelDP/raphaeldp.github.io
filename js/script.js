// Animation pour les sections
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }
  });
});

// Initialisation des animations
document.addEventListener("DOMContentLoaded", () => {
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });
});
