(function () {
  const ANG = 8; // grados para la base
  const wrap = document.getElementById("header");
  const shape = document.getElementById("hero__video");

  function applyPolygonBaseInclined() {
    const W = shape.clientWidth;
    const H = shape.clientHeight;
    if (W === 0 || H === 0) return;

    const rad = (ANG * Math.PI) / 180;
    const dy = Math.tan(rad) * W;

    const tlx = 0,
      tly = 0;
    const trx = W,
      tryy = 0;
    const brx = W,
      bry = Math.max(0, Math.round(H - dy));
    const blx = 0,
      bly = H;

    const path = `polygon(${tlx}px ${tly}px, ${trx}px ${tryy}px, ${brx}px ${bry}px, ${blx}px ${bly}px)`;
    shape.style.clipPath = path;
    shape.style.webkitClipPath = path;
  }

  window.addEventListener("resize", applyPolygonBaseInclined);
  window.addEventListener("load", applyPolygonBaseInclined);
  applyPolygonBaseInclined();
})();
