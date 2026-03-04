(function() {
  var PASS_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  var STORAGE_KEY = 'hc_auth';

  if (sessionStorage.getItem(STORAGE_KEY) === 'ok') return;


  // Inject overlay + hide real content via CSS
  var style = document.createElement('style');
  style.textContent = 'body > *:not(#auth-overlay) { display: none !important; }';
  document.documentElement.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#0a0a0a;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif';
  overlay.innerHTML = '<div style="text-align:center;color:#fff;max-width:360px;padding:2rem">'
    + '<h2 style="font-size:1.25rem;font-weight:600;margin-bottom:.5rem">Zugang geschuetzt</h2>'
    + '<p style="color:#999;font-size:.875rem;margin-bottom:1.5rem">Diese Seite befindet sich in Entwicklung.</p>'
    + '<input id="auth-pw" type="password" placeholder="Passwort" style="width:100%;padding:.75rem 1rem;border:1px solid #333;border-radius:8px;background:#141414;color:#fff;font-size:1rem;outline:none;margin-bottom:.75rem">'
    + '<button id="auth-btn" style="width:100%;padding:.75rem;border:none;border-radius:8px;background:#E94545;color:#fff;font-size:1rem;font-weight:600;cursor:pointer">Zugang</button>'
    + '<p id="auth-err" style="color:#E94545;font-size:.8rem;margin-top:.75rem;display:none">Falsches Passwort</p>'
    + '</div>';

  function init() {
    document.body.appendChild(overlay);

    var inp = document.getElementById('auth-pw');
    var btn = document.getElementById('auth-btn');
    var err = document.getElementById('auth-err');

    async function tryAuth() {
      var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(inp.value));
      var hash = Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
      if (hash === PASS_HASH) {
        sessionStorage.setItem(STORAGE_KEY, 'ok');
        overlay.remove();
        style.remove();
      } else {
        err.style.display = 'block';
        inp.value = '';
        inp.focus();
      }
    }

    btn.addEventListener('click', tryAuth);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') tryAuth(); });
    inp.focus();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
