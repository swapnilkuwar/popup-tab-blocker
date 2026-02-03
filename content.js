// Hard override window.open
window.open = function () {
  console.log("[BLOCKED] window.open from letsstream2.pages.dev");
  return null;
};

// Kill target=_blank clicks
document.addEventListener(
  "click",
  (e) => {
    const a = e.target.closest("a");
    if (a && a.target === "_blank") {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log("[BLOCKED] target=_blank click");
      return false;
    }
  },
  true,
);

// Prevent JS redirects
Object.defineProperty(window.location, "href", {
  set() {
    console.log("[BLOCKED] location.href redirect");
  },
});

// Optional: remove popup iframes
setInterval(() => {
  document.querySelectorAll("iframe").forEach((f) => {
    f.remove();
  });
}, 1000);
