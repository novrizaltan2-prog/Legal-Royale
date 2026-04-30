// ============================================================
// dialogManager.js — Antrian dialog berurutan (tidak overlap)
// ============================================================
//
// MASALAH: Dialog tumpang tindih karena semua audio dipanggil
// serentak tanpa menunggu yang sebelumnya selesai.
//
// SOLUSI:
// - DialogManager menggunakan index + callback chain
// - Audio berikutnya hanya diputar SETELAH audio sebelumnya
//   memanggil onEnd callback
// - Setiap step dipresentasikan dengan animasi ketik
// ============================================================

const DialogManager = (() => {
  let currentSession = null;   // key dari COURT_SESSIONS
  let dialogs        = [];     // array dialog aktif
  let currentIndex   = -1;    // posisi dialog saat ini
  let isPlaying      = false;  // sedang memutar audio?
  let speedMs        = 40;     // ms per karakter (typewriter)
  let typeInterval   = null;
  let subtitleOn     = true;

  const speedMap = { slow: 70, normal: 40, fast: 15 };

  // ---- Load session ----
  function loadSession(sessionKey) {
    currentSession = sessionKey;
    const session  = COURT_SESSIONS[sessionKey];
    if (!session) { console.error('Session not found:', sessionKey); return; }
    dialogs      = session.dialogs;
    currentIndex = -1;
    isPlaying    = false;

    // Update UI header
    const label = document.getElementById('session-label');
    if (label) label.textContent = 'Sesi: ' + (dialogs[0]?.session || '');

    // Enable start button
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) { btnPlay.disabled = false; btnPlay.textContent = '▶ Mulai Sidang'; }

    GameApp.showToast('📂 Kasus dimuat: ' + session.title);
  }

  // ---- Mulai dari awal ----
  function startSession() {
    if (!dialogs.length) {
      GameApp.showToast('⚠️ Pilih kasus dulu di menu Pilih Kasus');
      return;
    }
    currentIndex = -1;
    next();
  }

  // ---- Maju ke dialog berikutnya ----
  function next() {
    if (isPlaying) { skip(); return; }
    if (currentIndex >= dialogs.length - 1) {
      GameApp.showToast('✅ Persidangan selesai!');
      updateNavButtons();
      return;
    }
    currentIndex++;
    playDialog(currentIndex);
  }

  // ---- Mundur ke dialog sebelumnya ----
  function prev() {
    if (currentIndex <= 0) return;
    AudioManager.stop();
    isPlaying = false;
    currentIndex--;
    playDialog(currentIndex);
  }

  // ---- Ulangi dialog saat ini ----
  function replay() {
    if (currentIndex < 0) return;
    AudioManager.stop();
    isPlaying = false;
    playDialog(currentIndex);
  }

  // ---- Skip audio, lanjut ke teks selesai ----
  function skip() {
    if (typeInterval) { clearInterval(typeInterval); typeInterval = null; }
    AudioManager.stop();
    isPlaying = false;

    // Tampilkan teks penuh langsung
    if (currentIndex >= 0 && currentIndex < dialogs.length) {
      const d = dialogs[currentIndex];
      const el = document.getElementById('dialog-text');
      if (el) el.textContent = d.text;
    }
    setProgressBar(100);
    updateNavButtons();
  }

  // ---- Putar satu dialog ----
  function playDialog(idx) {
    const dialog = dialogs[idx];
    if (!dialog) return;

    isPlaying = true;
    updateNavButtons();

    const char = CHARACTERS[dialog.charId];
    if (!char) { console.error('Char not found:', dialog.charId); return; }

    // Update character stage
    updateCharStage(char);

    // Update session label
    const label = document.getElementById('session-label');
    if (label) label.textContent = dialog.session || '';

    // Tampilkan dialog box
    const speakerEl = document.getElementById('dialog-speaker');
    const textEl    = document.getElementById('dialog-text');
    if (speakerEl) speakerEl.textContent = char.name;
    if (textEl)    textEl.textContent = '';

    // Hitung durasi audio (fallback: panjang teks)
    const audioData = char.audio[dialog.audioKey];
    const estimatedDuration = dialog.text.length * speedMs;

    // Putar audio
    if (audioData) {
      AudioManager.play(audioData.file, audioData.formats, () => {
        // onEnd: selesai audio → lanjutkan interaksi
        isPlaying = false;
        updateNavButtons();
      });
    } else {
      // Tidak ada audio: tunggu typewriter selesai lalu unlock
      setTimeout(() => {
        isPlaying = false;
        updateNavButtons();
      }, estimatedDuration + 200);
    }

    // Jalankan typewriter teks (bersamaan dengan audio)
    if (subtitleOn) {
      typewriterAnimate(dialog.text, textEl, estimatedDuration);
    } else {
      if (textEl) textEl.textContent = dialog.text;
    }

    // Progress bar — estimasi durasi
    animateProgressBar(estimatedDuration);

    // Update chip karakter aktif
    updateActiveChip(dialog.charId);
  }

  // ---- Animasi typewriter ----
  function typewriterAnimate(text, el, totalMs) {
    if (!el) return;
    if (typeInterval) clearInterval(typeInterval);
    el.textContent = '';
    let i = 0;
    const delay = Math.max(15, totalMs / text.length);
    typeInterval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(typeInterval);
        typeInterval = null;
      }
    }, delay);
  }

  // ---- Progress bar animasi ----
  function animateProgressBar(durationMs) {
    setProgressBar(0);
    const bar = document.getElementById('dialog-progress-bar');
    if (!bar) return;
    bar.style.transition = `width ${durationMs}ms linear`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { bar.style.width = '100%'; });
    });
  }

  function setProgressBar(pct) {
    const bar = document.getElementById('dialog-progress-bar');
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = pct + '%';
  }

  // ---- Update tampilan karakter di stage ----
  function updateCharStage(char) {
    const avatar   = document.getElementById('char-avatar');
    const nameBadge= document.getElementById('char-name-badge');
    const roleBadge= document.getElementById('char-role-badge');
    if (avatar)    { avatar.textContent = char.icon; avatar.classList.add('speaking'); }
    if (nameBadge) nameBadge.textContent = char.name;
    if (roleBadge) roleBadge.textContent = char.role;

    setTimeout(() => {
      if (avatar) avatar.classList.remove('speaking');
    }, 800);
  }

  // ---- Update chip aktif ----
  function updateActiveChip(charId) {
    document.querySelectorAll('.char-chip').forEach(el => {
      el.classList.toggle('active', el.dataset.charId === charId);
    });
  }

  // ---- Update tombol navigasi ----
  function updateNavButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnPlay = document.getElementById('btn-play');
    if (btnPrev) btnPrev.disabled = currentIndex <= 0;
    if (btnNext) btnNext.disabled = isPlaying || currentIndex >= dialogs.length - 1;
    if (btnPlay) { btnPlay.disabled = true; btnPlay.textContent = '▶▶'; }
  }

  // ---- Voice-over karakter manual (dari chip) ----
  function playCharVoice(charId, audioKey) {
    const char = CHARACTERS[charId];
    if (!char) return;
    AudioManager.stop();
    isPlaying = false;
    const audioData = char.audio[audioKey];
    if (audioData) {
      updateCharStage(char);
      updateActiveChip(charId);
      AudioManager.play(audioData.file, audioData.formats, null);

      // Tampilkan dialog chip
      const speakerEl = document.getElementById('dialog-speaker');
      const textEl    = document.getElementById('dialog-text');
      if (speakerEl) speakerEl.textContent = char.name;
      if (textEl)    textEl.textContent = `[Voice-over: ${char.name}]`;
    }
  }

  // ---- Speed ----
  function setSpeed(val) {
    speedMs = speedMap[val] || 40;
  }

  return { loadSession, startSession, next, prev, replay, skip, playCharVoice, setSpeed };
})();