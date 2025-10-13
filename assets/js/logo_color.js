document.addEventListener("DOMContentLoaded", () => {
  const logoHost = document.getElementById("logo"); // <a id="logo">
  const logoObject = document.getElementById("miSvg"); // <object id="miSvg">
  const sections = Array.from(document.querySelectorAll(".bg-white, .bg-dark"));
  if (!logoHost || !logoObject || !sections.length) return;

  let svgDoc = null;
  let targets = [];

  function readCssVar(name) {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || ""
    );
  }

  function setTargetsClass(add) {
    if (!targets.length) return;
    targets.forEach((el) => {
      const prev = el.getAttribute("class") || "";
      const classes = new Set(prev.split(/\s+/).filter(Boolean));
      if (add) {
        classes.add("logo-black");
        classes.delete("st0");
      } else {
        classes.delete("logo-black");
        classes.add("st0");
      }
      el.setAttribute("class", [...classes].join(" "));
    });
  }

  // Inserta <style> correctamente en el SVG (dentro de <defs> si existe, o como primer hijo del <svg>)
  function injectStyleIntoSvg(svgDoc, c1, c2) {
    const svgEl = svgDoc.querySelector("svg");
    if (!svgEl) return;
    const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
    style.setAttribute("type", "text/css");
    style.textContent = `
      :root { --color-accent-1: ${c1}; --color-accent-2: ${c2}; }
      .logo-black { fill: var(--color-accent-1) !important; transition: fill 0.5s ease;}
      .st0 { fill: var(--color-accent-2) ;transition: fill 0.5s ease; }
    `;

    const defs = svgEl.querySelector("defs");
    if (defs) defs.appendChild(style);
    else svgEl.insertBefore(style, svgEl.firstChild);
  }

  logoObject.addEventListener("load", () => {
    svgDoc = logoObject.contentDocument;
    if (!svgDoc) return;

    // seleccionar el root SVG por su id Ebene_1 y luego los paths .st0 dentro
    const svgRootById = svgDoc.getElementById("Ebene_1");
    const scope = svgRootById || svgDoc.querySelector("svg");
    targets = scope ? Array.from(scope.querySelectorAll("path.st0, .st0")) : [];

    const c1 = readCssVar("--color-accent-1");
    const c2 = readCssVar("--color-accent-2");

    injectStyleIntoSvg(svgDoc, c1, c2);

    // evaluar estado inicial ahora que el SVG y el style están presentes
    evaluate();
  });

  function logoMidY() {
    const r = logoHost.getBoundingClientRect();
    return r.top + r.height;
  }

  function applyForSection(sec) {
    const isWhite = sec.classList.contains("bg-white");
    setTargetsClass(isWhite);
    if (isWhite) {
      logoHost.classList.add("logo-black");
      logoHost.classList.remove("st0");
    } else logoHost.classList.remove("logo-black");
  }

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
      setTargetsClass(false);
      logoHost.classList.remove("logo-black");
    }
  }

  const io = new IntersectionObserver(() => evaluate(), {
    root: null,
    threshold: [0],
  });
  sections.forEach((s) => io.observe(s));

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

  // inicial: espera corto en caso de que object tarde a cargar
  setTimeout(evaluate, 100);
});
