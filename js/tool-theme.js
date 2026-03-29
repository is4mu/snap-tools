(function () {
  function syncThemeToggleUi() {
    var btn = document.querySelector(".theme-toggle-btn");
    if (!btn) return;
    var isDark = document.documentElement.classList.contains("tool-theme-dark");
    var nextLabel = isDark ? "ライトテーマに切り替え" : "ダークテーマに切り替え";
    btn.setAttribute("aria-label", nextLabel);
    btn.setAttribute("title", nextLabel);
  }

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest(".theme-toggle-btn");
    if (!btn) return;
    var isDark = document.documentElement.classList.contains("tool-theme-dark");
    var next = isDark ? "light" : "dark";
    document.documentElement.classList.remove(
      "tool-theme-light",
      "tool-theme-dark"
    );
    document.documentElement.classList.add(
      next === "dark" ? "tool-theme-dark" : "tool-theme-light"
    );
    try {
      localStorage.setItem("snap-tools-theme", next);
    } catch (_) {}
    syncThemeToggleUi();
  });

  window.syncThemeToggleUi = syncThemeToggleUi;
})();
