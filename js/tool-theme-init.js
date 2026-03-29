(function () {
  var stored = localStorage.getItem("snap-tools-theme");
  var dark = stored !== "light";
  document.documentElement.classList.add(
    dark ? "tool-theme-dark" : "tool-theme-light"
  );
})();
