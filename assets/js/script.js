document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var sections = Array.from(document.querySelectorAll('.main-content > section'));
  var navLinks = Array.from(document.querySelectorAll('.nav-link'));

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.id) {
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === entry.target.id);
          });
        }
      }
    });
  }, { threshold: 0.14 });

  sections.forEach(function (section) {
    revealObserver.observe(section);
  });

  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var end = Number(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var duration = 1100;
      var startTime = null;

      function tick(time) {
        if (!startTime) startTime = time;
        var progress = Math.min((time - startTime) / duration, 1);
        var value = Math.floor(progress * end);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = end + suffix;
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.7 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  var modal = document.getElementById('cert-modal');
  var modalImg = document.getElementById('cert-modal-img');
  var closeBtn = modal && modal.querySelector('.cert-modal-close');

  function openModal(src, alt) {
    if (!modal) return;
    modalImg.src = src;
    modalImg.alt = alt || 'Sertifikat';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-cert').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = this.getAttribute('data-src');
      var alt = this.querySelector('img') && this.querySelector('img').alt;
      openModal(src, alt);
    });
  });

  modal && modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close') || e.target.classList.contains('cert-modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});
