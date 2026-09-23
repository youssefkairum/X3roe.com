// Runs synchronously in <head>: lets CSS hide .reveal content only when JS works.
// If site.js has not started within 3s (blocked or failed), show everything.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  setTimeout(function () {
    if (!window.__x3roeReady) root.classList.remove('js');
  }, 3000);
})();
