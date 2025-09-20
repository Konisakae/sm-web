function updateTrapezoid(angleDeg = 8) {
  const el = document.getElementById("trap");
  const H = el.clientHeight; // altura en px
  const dx = Math.tan((angleDeg * Math.PI) / 180) * H; // desplazamiento en px
  // mover la esquina derecha hacia la derecha (o usa negativa para la izquierda)
  const brX = el.clientWidth + dx;
  // construimos clip-path en px para mantener el ángulo exacto
  const path = `polygon(0px 0px, ${el.clientWidth}px 0px, ${brX}px ${H}px, 0px ${H}px)`;
  el.style.clipPath = path;
  el.style.webkitClipPath = path;
}

window.addEventListener("resize", () => updateTrapezoid(8));
window.addEventListener("load", () => updateTrapezoid(8));
