(function () {
  var DEBOUNCE_MS = 400;
  /** 非同期 toCanvas のコールバックが古い入力の結果で上書きしないようにする */
  var qrRenderSeq = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  function clearQrCanvas(canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setError(msg) {
    var el = $("qrError");
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function render() {
    var input = $("qrInput");
    var canvas = $("qrCanvas");
    var downloadBtn = $("qrDownload");
    var QRCode = window.QRCode;

    if (!input || !canvas || !downloadBtn) return;

    var seq = ++qrRenderSeq;
    var text = input.value.trim();

    if (!text) {
      clearQrCanvas(canvas);
      canvas.hidden = true;
      setError("");
      downloadBtn.disabled = true;
      return;
    }

    if (typeof QRCode === "undefined" || typeof QRCode.toCanvas !== "function") {
      setError("QR ライブラリの読み込みに失敗しました。");
      downloadBtn.disabled = true;
      return;
    }

    var size = parseInt($("qrSize").value, 10) || 256;
    var ec = $("qrEc").value || "M";

    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        margin: 2,
        errorCorrectionLevel: ec,
        color: { dark: "#000000", light: "#ffffff" },
      },
      function (err) {
        if (seq !== qrRenderSeq) return;
        if (input.value.trim() !== text) return;

        if (err) {
          clearQrCanvas(canvas);
          canvas.hidden = true;
          downloadBtn.disabled = true;
          setError(
            err.message ||
              "生成できませんでした。文字数が多すぎるか、内容が不正な可能性があります。"
          );
          return;
        }
        canvas.hidden = false;
        setError("");
        downloadBtn.disabled = false;
      }
    );
  }

  function downloadPng() {
    var canvas = $("qrCanvas");
    if (!canvas || canvas.hidden) return;

    try {
      var dataUrl = canvas.toDataURL("image/png");
      var a = document.createElement("a");
      a.href = dataUrl;
      a.download = "qrcode.png";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof window.showCopyToast === "function") {
        window.showCopyToast("PNG を保存しました");
      }
    } catch (e) {
      if (typeof window.showCopyToast === "function") {
        window.showCopyToast("保存に失敗しました");
      }
    }
  }

  function init() {
    var input = $("qrInput");
    var sizeEl = $("qrSize");
    var ecEl = $("qrEc");
    var downloadBtn = $("qrDownload");

    if (!input) return;

    var run = debounce(render, DEBOUNCE_MS);

    input.addEventListener("input", function () {
      if (!input.value.trim()) {
        qrRenderSeq++;
        clearQrCanvas($("qrCanvas"));
        var c = $("qrCanvas");
        var dl = $("qrDownload");
        if (c) c.hidden = true;
        if (dl) dl.disabled = true;
        setError("");
      }
      run();
    });

    if (sizeEl) sizeEl.addEventListener("change", render);
    if (ecEl) ecEl.addEventListener("change", render);

    if (downloadBtn) {
      downloadBtn.addEventListener("click", downloadPng);
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
