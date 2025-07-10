export function showLoader() {
  const accordionWrap = document.querySelector(".events-accordion-wrap");
  const loaderWrap = document.querySelector(".content-loader-wrap");
  if (accordionWrap) accordionWrap.style.display = "none";
  if (loaderWrap) loaderWrap.style.display = "flex";
}

export function hideLoader() {
  const accordionWrap = document.querySelector(".events-accordion-wrap");
  const loaderWrap = document.querySelector(".content-loader-wrap");
  if (loaderWrap) loaderWrap.style.display = "none";
  if (accordionWrap) accordionWrap.style.display = "block";
}
