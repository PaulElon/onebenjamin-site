// One Benjamin counter: page, source, and clicks to the Kit, GitHub, and X. No cookies. Source = utm_source, else referrer host, else "direct".
(function () {
  try {
    var q = new URLSearchParams(location.search);
    var s = q.get("utm_source") || q.get("ref") || (document.referrer ? new URL(document.referrer).hostname : "direct");
    if (s === location.hostname) s = "internal";
    var base = "https://onebenjamin.pages.dev/api/h?p=" + encodeURIComponent(location.pathname) + "&s=" + encodeURIComponent(s);
    var send = function (e) { var u = base + "&e=" + e; if (navigator.sendBeacon) navigator.sendBeacon(u); else fetch(u, { method: "POST", keepalive: true, mode: "no-cors" }); };
    send("view");
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a"); if (!a) return;
      var h = a.href || "";
      var e = a.id === "kit-buy" ? "kit_click" : h.indexOf("github.com") > -1 ? "repo_click" : h.indexOf("x.com") > -1 ? "x_click" : h.indexOf("/sample") > -1 ? "sample_click" : h.indexOf("apps.shopify.com") > -1 ? "app_click" : null;
      if (e) send(e);
    });
  } catch (e) {}
})();
