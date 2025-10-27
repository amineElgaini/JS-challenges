const imageUrls = [
  "https://picsum.photos/id/236/200/300",
  "https://picsum.photos/id/237/200/300",
  "https://picsum.photos/id/238/200/300",
  "https://picsum.photos/id/239/200/300",
  "https://picsum.photos/id/240/200/300",
];

const slider = document.querySelector(".slider");
imageUrls.forEach((url, i) => {
  const img = document.createElement("img");
  img.src = url;
  slider.prepend(img);
});

const imgs = document.querySelectorAll("img");
const left = document.querySelector(".left");
const right = document.querySelector(".right");

let prev = 0;
let next = 0;
let isAnimating = false;

left.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;

  next = (prev + 1) % imgs.length;

  imgs[next].style.transition = "none";
  imgs[next].style.transform = "translateX(100%)";
  imgs[next].offsetWidth;

  imgs[prev].style.cssText = `
        transition: transform 1s;
        transform: translateX(-100%);
        `;
  imgs[next].style.cssText = `
        transition: transform 1s;
        transform: translateX(0%);
    `;
  prev = next;

  imgs[prev].addEventListener(
    "transitionend",
    () => {
      isAnimating = false;
    },
    { once: true }
  );
});

right.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  next = prev - 1 < 0 ? imgs.length - 1 : prev - 1;

  imgs[next].style.transition = "none";
  imgs[next].style.transform = "translateX(-100%)";
  imgs[next].offsetWidth;

  imgs[prev].style.cssText = `
        transition: transform 1s;
        transform: translateX(100%);
        `;
  imgs[next].style.cssText = `
        transition: transform 1s;
        transform: translateX(0%);
    `;

  prev = next;

  imgs[prev].addEventListener(
    "transitionend",
    () => {
      isAnimating = false;
    },
    { once: true }
  );
});
