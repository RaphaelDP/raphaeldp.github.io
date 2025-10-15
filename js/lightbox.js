document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");
  document.body.appendChild(lightbox);

  const img = document.createElement("img");
  lightbox.appendChild(img);

  document
    .querySelectorAll(".project-gallery img, .project-thumbnail")
    .forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        img.src = thumbnail.src;
        lightbox.classList.add("active");
      });
    });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });
});
