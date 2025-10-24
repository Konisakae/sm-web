document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector("img.lozy");
  if (!img) return;
  function loadImage() {
    if (!img.dataset.src) return;
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
    img.addEventListener("load", () => img.classList.add("loaded"), {
      once: true,
    });
    observer && observer.disconnect();
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadImage();
        });
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.01 }
    );
    observer.observe(img);
  } else {
    loadImage();
  }
});
