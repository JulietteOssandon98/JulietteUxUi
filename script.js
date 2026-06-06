// Reveal on scroll
const els = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(e => e.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('on'); obs.unobserve(x.target); }
}), { threshold: 0.1 });
els.forEach(el => obs.observe(el));

// Navbar shrink on scroll
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 50 ? '0.7rem 0' : '1.1rem 0';
});

// Formspree contact form
const sendBtn = document.getElementById('sendBtn');
const feedback = document.getElementById('form-feedback');

function showFeedback(type, message) {
  feedback.className = 'form-feedback ' + type;
  feedback.innerHTML = message;
  feedback.style.display = 'flex';
}

sendBtn.addEventListener('click', async function () {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const service = document.getElementById('f-service').value;
  const message = document.getElementById('f-message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    showFeedback('error', '<i class="bi bi-exclamation-circle"></i> Por favor completa los campos obligatorios.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFeedback('error', '<i class="bi bi-exclamation-circle"></i> Ingresa un email válido.');
    return;
  }

  // Loading state
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
  feedback.style.display = 'none';

  try {
    const res = await fetch('https://formspree.io/f/xkokoeaa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, service, message })
    });

    if (res.ok) {
      showFeedback('success', '<i class="bi bi-check-circle"></i> ¡Mensaje enviado! Te respondo en menos de 24 horas.');
      sendBtn.innerHTML = '<i class="bi bi-check-lg"></i> Mensaje enviado';
      // Clear fields
      document.getElementById('f-name').value = '';
      document.getElementById('f-email').value = '';
      document.getElementById('f-service').value = '';
      document.getElementById('f-message').value = '';
      // Reset button after 4s
      setTimeout(() => {
        sendBtn.innerHTML = 'Enviar mensaje <i class="bi bi-arrow-up-right"></i>';
        sendBtn.disabled = false;
      }, 4000);
    } else {
      const data = await res.json();
      const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Hubo un error al enviar.';
      showFeedback('error', '<i class="bi bi-exclamation-circle"></i> ' + errMsg);
      sendBtn.innerHTML = 'Enviar mensaje <i class="bi bi-arrow-up-right"></i>';
      sendBtn.disabled = false;
    }
  } catch (err) {
    showFeedback('error', '<i class="bi bi-wifi-off"></i> Sin conexión. Intenta nuevamente.');
    sendBtn.innerHTML = 'Enviar mensaje <i class="bi bi-arrow-up-right"></i>';
    sendBtn.disabled = false;
  }
});



/* ============================================================
   script.js — Juliette Ossandón Portfolio
   Cursor personalizado + lógica general
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;
  let raf;

  /* Actualiza posición del punto instantáneamente */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    if (!document.body.classList.contains('cursor-ready')) {
      document.body.classList.add('cursor-ready');
    }
  });

  /* El ring sigue con suavizado (lerp) */
  function lerpRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(lerpRing);
  }
  lerpRing();

  /* Hover sobre elementos interactivos */
  const hoverTargets = 'a, button, [role="button"], input, select, textarea, label, .svc-item, .proj-row, .proc-row';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  /* Click: efecto de escala */
  document.addEventListener('mousedown', function () {
    ring.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  document.addEventListener('mouseup', function () {
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  /* Ocultar cursor cuando sale de la ventana */
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });

  /* ----------------------------------------------------------
     2. REVEAL ON SCROLL
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback para navegadores sin IntersectionObserver */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----------------------------------------------------------
     3. NAVBAR — sombra al hacer scroll
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     4. FORMULARIO DE CONTACTO — envío + feedback
  ---------------------------------------------------------- */
  var sendBtn  = document.getElementById('sendBtn');
  var feedback = document.getElementById('form-feedback');

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var name    = (document.getElementById('f-name')    || {}).value || '';
      var email   = (document.getElementById('f-email')   || {}).value || '';
      var service = (document.getElementById('f-service') || {}).value || '';
      var message = (document.getElementById('f-message') || {}).value || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        show(feedback, 'Por favor completa todos los campos.', 'err');
        return;
      }

      if (!isValidEmail(email)) {
        show(feedback, 'Ingresa un correo electrónico válido.', 'err');
        return;
      }

      /* Simulación de envío — reemplaza con tu lógica real */
      sendBtn.disabled = true;
      sendBtn.textContent = 'Enviando…';

      setTimeout(function () {
        show(feedback, '¡Mensaje enviado! Te responderé en menos de 24 horas.', 'ok');
        sendBtn.textContent = 'Mensaje enviado ✓';
        setTimeout(function () {
          sendBtn.disabled = false;
          sendBtn.innerHTML = 'Enviar mensaje <i class="bi bi-arrow-up-right"></i>';
        }, 4000);
      }, 1200);
    });
  }

  function show(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-feedback ' + type;
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ----------------------------------------------------------
     5. TICKER — pausa al hover
  ---------------------------------------------------------- */
  var tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', function () {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', function () {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  /* ----------------------------------------------------------
     6. ACTIVE NAV LINK — resalta el link de la sección visible
  ---------------------------------------------------------- */
  var sections  = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-link-item');

  if (sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* Estilo activo */
  var style = document.createElement('style');
  style.textContent = '.nav-link-item.active { color: var(--clr-text) !important; }';
  document.head.appendChild(style);

})();