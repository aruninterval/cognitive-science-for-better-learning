/* Minimal SCORM 1.2 runtime wrapper with localStorage fallback for standalone preview */
var SCORM = (function () {
  var api = null, connected = false, start = new Date(), LS = "cogsci_scorm_preview";
  var local = {};

  function find(win) {
    var tries = 0;
    while (win && !win.API && win.parent && win.parent !== win && tries < 10) { win = win.parent; tries++; }
    return (win && win.API) || null;
  }

  function init() {
    api = find(window);
    if (!api && window.opener) { try { api = find(window.opener); } catch (e) {} }
    if (api) {
      var r = api.LMSInitialize("");
      connected = (r === true || r === "true");
    }
    if (!connected) {
      try { local = JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { local = {}; }
    }
    return connected;
  }

  function get(k) {
    if (connected) return api.LMSGetValue(k);
    return local[k] || "";
  }

  function set(k, v) {
    if (connected) return api.LMSSetValue(k, String(v));
    local[k] = String(v);
    try { localStorage.setItem(LS, JSON.stringify(local)); } catch (e) {}
    return "true";
  }

  function commit() { if (connected) api.LMSCommit(""); }

  function pad(n, l) { n = String(n); while (n.length < l) n = "0" + n; return n; }
  function sessionTime() {
    var s = Math.round((new Date() - start) / 1000);
    return pad(Math.floor(s / 3600), 4) + ":" + pad(Math.floor((s % 3600) / 60), 2) + ":" + pad(s % 60, 2);
  }

  function finish() {
    if (connected) {
      api.LMSSetValue("cmi.core.session_time", sessionTime());
      api.LMSSetValue("cmi.core.exit", "suspend");
      api.LMSCommit("");
      api.LMSFinish("");
      connected = false;
    }
  }

  return { init: init, get: get, set: set, commit: commit, finish: finish,
           isConnected: function () { return connected; } };
})();
