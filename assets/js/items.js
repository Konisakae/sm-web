const items = Array.from(document.querySelectorAll(".item"));

function closeItem(item) {
  const btn = item.querySelector(".toggle-btn");
  const wrap = item.querySelector(".content-wrap");
  wrap.style.maxHeight = "0";
  wrap.style.opacity = "0";
  item.classList.remove("expanded");
  btn.setAttribute("aria-expanded", "false");
  btn.querySelector("svg").style.transform = "";
}

function openItem(item) {
  const btn = item.querySelector(".toggle-btn");
  const wrap = item.querySelector(".content-wrap");
  wrap.style.maxHeight = wrap.scrollHeight + "px";
  wrap.style.opacity = "1";
  item.classList.add("expanded");
  btn.setAttribute("aria-expanded", "true");
  // opcional pequeña rotación del SVG para efecto
  btn.querySelector("svg").style.transform = "rotate(0deg)";
}

function toggleItem(item) {
  const isOpen = item.classList.contains("expanded");
  if (isOpen) closeItem(item);
  else {
    items.forEach((i) => {
      if (i !== item) closeItem(i);
    });
    openItem(item);
  }
}

items.forEach((item) => {
  const btn = item.querySelector(".toggle-btn");
  const wrap = item.querySelector(".content-wrap");

  btn.addEventListener("click", () => toggleItem(item));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(item);
    }
  });

  const ro = new ResizeObserver(() => {
    if (item.classList.contains("expanded"))
      wrap.style.maxHeight = wrap.scrollHeight + "px";
  });
  ro.observe(wrap);
});
