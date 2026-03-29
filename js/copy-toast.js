(function () {
  var hideTimer = null;
  var transitionTimer = null;
  var HIDE_AFTER_MS = 2000;
  var TRANSITION_MS = 280;

  function ensureEl() {
    var el = document.getElementById("copy-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "copy-toast";
      el.className = "copy-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    return el;
  }

  window.showCopyToast = function (message) {
    message = message || "コピーしました";
    var el = ensureEl();

    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    el.textContent = message;
    el.setAttribute("aria-hidden", "false");

    requestAnimationFrame(function () {
      el.classList.add("copy-toast--visible");
    });

    hideTimer = setTimeout(function () {
      hideTimer = null;
      el.classList.remove("copy-toast--visible");
      el.setAttribute("aria-hidden", "true");
      transitionTimer = setTimeout(function () {
        transitionTimer = null;
        el.textContent = "";
      }, TRANSITION_MS);
    }, HIDE_AFTER_MS);
  };
})();
