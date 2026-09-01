(function () {
  const app = document.querySelector('.app');
  const gates = document.getElementById('gates');
  const invitation = document.querySelector('.invitation');
  const music = document.getElementById('bg-music');
  let opened = false;
  let musicStarted = false;

  function startMusic() {
    if (musicStarted || !music) return;

    music.volume = 0.45;
    const playPromise = music.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          musicStarted = true;
        })
        .catch(function () {
          // Autoplay blocked until user interacts — retried on gate open.
        });
    }
  }

  function openGates() {
    if (opened) return;
    opened = true;

    startMusic();

    app.classList.add('is-open');
    gates.classList.add('is-open');
    gates.classList.remove('is-pressing');
    gates.setAttribute('aria-hidden', 'true');
    invitation.setAttribute('aria-hidden', 'false');

    // Remove overlay from tab order after animation
    setTimeout(function () {
      gates.style.visibility = 'hidden';
    }, 2000);
  }

  gates.addEventListener('click', openGates);

  gates.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGates();
    }
  });

  // Soft press feedback before opening
  gates.addEventListener('touchstart', function () {
    startMusic();
    if (!opened) gates.classList.add('is-pressing');
  }, { passive: true });

  gates.addEventListener('touchend', function () {
    gates.classList.remove('is-pressing');
  }, { passive: true });

  // Prevent double-tap zoom on iOS
  let lastTouch = 0;
  document.addEventListener('touchend', function (e) {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  }, { passive: false });

  window.addEventListener('load', startMusic);
})();
