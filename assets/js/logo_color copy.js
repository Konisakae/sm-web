document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const sections = Array.from(document.querySelectorAll(".bg-white, .bg-dark"));
  if (!logo || !sections.length) return;

  function logoMidY() {
    const r = logo.getBoundingClientRect();
    return r.top + r.height;
  }

  // Decide y aplica estado según la sección "activa"
  function applyForSection(sec) {
    if (sec.classList.contains("bg-white")) logo.classList.add("logo-black");
    else logo.classList.remove("logo-black");
  }

  // Encuentra la sección cuyo top está más cerca pero <= midY (la más arriba que ha cruzado la línea)
  function evaluate() {
    const midY = logoMidY();
    let candidate = null;
    for (const s of sections) {
      const top = s.getBoundingClientRect().top;
      if (top <= midY) {
        if (!candidate) candidate = s;
        else if (top > candidate.getBoundingClientRect().top) candidate = s;
      }
    }
    if (candidate) applyForSection(candidate);
    else {
      // fallback: si ninguna sección ha cruzado la línea, decidir estado por la primera sección debajo
      // opcional: mantener estado actual; aquí quitamos logo-black por seguridad
      logo.classList.remove("logo-black");
    }
  }

  // Observador para detectar entradas/salidas rápidamente (mejora rendimiento)
  const io = new IntersectionObserver(
    (entries) => {
      // cuando una sección intersecta con viewport, reevaluamos globalmente
      // (no confiamos en entry individual para lógica por la dependencia midY dinámica)
      evaluate();
    },
    { root: null, threshold: [0], rootMargin: "0px" }
  );

  sections.forEach((s) => io.observe(s));

  // Además, reevalúa en scroll/resize para asegurar respuesta instantánea y precisa
  let rafScheduled = false;
  function scheduleEvaluate() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      evaluate();
      rafScheduled = false;
    });
  }

  window.addEventListener("scroll", scheduleEvaluate, { passive: true });
  window.addEventListener("resize", scheduleEvaluate);

  // Inicial
  setTimeout(evaluate, 50);
});
