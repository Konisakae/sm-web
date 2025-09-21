(function () {
  const ANG = 8; // grados de inclinación de la base
  const wrap = document.getElementById("header");
  const shape = document.getElementById("hero__video");

  function updateWrapAndShape() {
    const W = Math.round(window.innerWidth);
    const vpH = Math.round(window.innerHeight); // esquina derecha debe quedar en y = vpH
    const rad = (ANG * Math.PI) / 180;
    const dy = Math.tan(rad) * W; // px que la esquina izquierda debe bajar respecto a la derecha

    const rightY = vpH;
    const leftY = Math.round(vpH + dy);

    // Ajustar la altura de wrap para contener la esquina más baja.
    // wrap está en top:0 del documento; height debe ser leftY para que la esquina quede dentro.
    wrap.style.height = leftY + "px";

    // Ahora shape ocupa 100% de wrap, por lo que sus coordenadas internas llegan hasta leftY.
    // Construir clip-path con vértices relativos a shape (coordenadas en px dentro de wrap/shape).
    const tlx = 0,
      tly = 0;
    const trx = W,
      tryy = 0;
    const brx = W,
      bry = rightY;
    const blx = 0,
      bly = leftY;

    const path = `polygon(${tlx}px ${tly}px, ${trx}px ${tryy}px, ${brx}px ${bry}px, ${blx}px ${bly}px)`;
    shape.style.clipPath = path;
    shape.style.webkitClipPath = path;
  }

  // Ejecutar en carga y resize; usar requestAnimationFrame para evitar layout thrash en resize continuo.
  let rafId = null;
  function scheduleUpdate() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateWrapAndShape();
      rafId = null;
    });
  }

  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  scheduleUpdate();
})();
