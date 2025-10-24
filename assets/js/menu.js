const buttonElement = document.querySelector(".menuToggle");
const mediaWrapper = document.querySelector(".video-no");

buttonElement.addEventListener("click", function (event) {
  let expanded = this.getAttribute("aria-expanded") === "true";
  mediaWrapper.setAttribute("aria-hidden", expanded);
  this.setAttribute("aria-expanded", !expanded);
  event.preventDefault();
});
