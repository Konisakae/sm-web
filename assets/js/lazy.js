document.addEventListener("DOMContentLoaded", () => {
  const svgs = document.querySelectorAll(".svg-lazy");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const svg = entry.target;
        const img = svg.querySelector("image.svg-image");
        const src = img.getAttribute("data-href");

        if (entry.isIntersecting) {
          // cargar imagen (si no está ya)
          if (src && img.getAttribute("href") !== src) {
            img.setAttribute("href", src);
            try {
              img.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
            } catch (e) {}
            // usar Image() para detectar carga real
            const checker = new Image();
            checker.onload = () => svg.classList.add("is-visible");
            checker.onerror = () => svg.classList.add("is-visible"); // quitar blur aunque falle
            checker.src = src;
          } else {
            // ya tiene href asignado: simplemente mostrar
            svg.classList.add("is-visible");
          }
        } else {
          // fuera del viewport: volver a estado "lazy"
          svg.classList.remove("is-visible");

          // opcional: eliminar href para liberar memoria/carga al volver a entrar
          // comentar si prefieres mantener la imagen cargada
          if (img.hasAttribute("href")) {
            img.removeAttribute("href");
            try {
              img.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
            } catch (e) {}
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px 100px 0px",
      threshold: 0.1,
    }
  );

  svgs.forEach((s) => io.observe(s));
});
