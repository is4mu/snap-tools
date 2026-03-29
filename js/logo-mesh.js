(function () {
  var meshCache = null;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildMeshGradient() {
    var themeHue = rand(0, 360);
    var hueRound = Math.round(themeHue);
    var base =
      "hsla(" +
      hueRound +
      ", " +
      Math.round(rand(42, 56)) +
      "%, " +
      Math.round(rand(78, 88)) +
      "%, 1)";
    var layers = [];
    var i;
    for (i = 0; i < 7; i++) {
      var x = rand(4, 96);
      var y = rand(4, 96);
      var dh = rand(-55, 55);
      var h = (themeHue + dh + 360) % 360;
      var s = rand(40, 62);
      var l = rand(72, 92);
      var spot =
        "hsla(" +
        Math.round(h) +
        ", " +
        Math.round(s) +
        "%, " +
        Math.round(l) +
        "%, 1)";
      layers.push(
        "radial-gradient(circle at " +
          Math.round(x) +
          "% " +
          Math.round(y) +
          "%, " +
          spot +
          " 5%, transparent 55%)"
      );
    }
    return {
      backgroundColor: base,
      backgroundImage: layers.join(", "),
      backgroundBlendMode: "normal, normal, normal, normal, normal, normal, normal",
      themeHue: hueRound,
      accent: "hsl(" + hueRound + ", 68%, 48%)",
      accentBright: "hsl(" + hueRound + ", 72%, 63%)",
    };
  }

  function getMesh() {
    if (!meshCache) {
      meshCache = buildMeshGradient();
    }
    return meshCache;
  }

  function applySnapLogoMesh() {
    var mesh = getMesh();
    document.documentElement.style.setProperty("--snap-accent", mesh.accent);
    document.documentElement.style.setProperty("--snap-accent-bright", mesh.accentBright);
    var els = document.querySelectorAll(".logo-icon, .logo-icon-header");
    var n = els.length;
    var i;
    for (i = 0; i < n; i++) {
      els[i].style.backgroundColor = mesh.backgroundColor;
      els[i].style.backgroundImage = mesh.backgroundImage;
      els[i].style.backgroundBlendMode = mesh.backgroundBlendMode;
    }
  }

  window.applySnapLogoMesh = applySnapLogoMesh;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySnapLogoMesh);
  } else {
    applySnapLogoMesh();
  }
})();
