// Contact forms (Formspree). Progressive enhancement for every form[data-contact-form]:
// without JS the form still POSTs to Formspree; with JS it submits in place and shows
// a real success or error message (never a fake "Sent!").
(function () {
  var forms = document.querySelectorAll('form[data-contact-form]');

  forms.forEach(function (form) {
    var email = form.getAttribute('data-fallback-email') || 'contact@x3roe.com';
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('[data-submit]') || form.querySelector('[type="submit"]');
    var buttonLabel = button ? button.textContent : '';

    var show = function (state, message, withEmail, noFocus) {
      if (!status) return;
      status.setAttribute('data-state', state);
      status.textContent = message;
      if (withEmail) {
        status.appendChild(document.createTextNode(' '));
        var link = document.createElement('a');
        link.href = 'mailto:' + email;
        link.textContent = email;
        link.className = 'underline';
        status.appendChild(link);
        status.appendChild(document.createTextNode('.'));
      }
      if (!noFocus) status.focus();
    };

    // Not configured yet (placeholder form ID): keep the page honest.
    if (/REPLACE_WITH_/.test(form.getAttribute('action') || '')) {
      form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
      show('error', 'The contact form is not available yet. Please email', true, true);
      return;
    }

    // Clear an earlier success or error message once the visitor edits the form or tries to
    // send again (the browser's own validation may block that attempt before 'submit' fires).
    var clearStatus = function () {
      if (!status || status.getAttribute('data-state') === 'pending') return;
      status.removeAttribute('data-state');
      status.textContent = '';
    };
    form.addEventListener('input', clearStatus);
    form.addEventListener('invalid', clearStatus, true);

    // Keep a focused field clear of a fixed header. Browsers skip their focus scroll when the
    // field is already partly in view, even if the header covers it. Runs after that scroll;
    // block 'nearest' honours the page's scroll-margin on the controls.
    form.addEventListener('focusin', function (event) {
      var el = event.target;
      window.setTimeout(function () {
        if (document.activeElement !== el) return;
        var header = document.querySelector('header.fixed, .site-header');
        var limit = header ? header.getBoundingClientRect().bottom : 0;
        var rect = el.getBoundingClientRect();
        if (rect.top < limit || rect.bottom > window.innerHeight) el.scrollIntoView({ block: 'nearest' });
      }, 0);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }
      show('pending', 'Sending your message…', false, true);

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (data) {
            if (response.ok) {
              form.reset();
              show('success', 'Thanks! Your message was sent. We will reply to the email address you entered.');
              return;
            }
            var detail = data && data.errors && data.errors.length
              ? data.errors.map(function (e) { return e.message; }).join(' ')
              : 'Something went wrong.';
            show('error', 'Your message could not be sent. ' + detail + ' Please try again, or email', true);
          });
        })
        .catch(function () {
          show('error', 'Your message could not be sent (network error). Please try again, or email', true);
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = buttonLabel;
          }
        });
    });
  });
})();
