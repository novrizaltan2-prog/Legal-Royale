// ============================================================
// audioManager.js — Manajemen audio multiformat untuk APK
// ============================================================
//
// MASALAH APK:
// 1. Android WebView memblokir autoplay tanpa interaksi user
// 2. Tidak semua format didukung semua versi Android
// 3. Path harus relatif, bukan absolut
// 4. Audio bisa gagal silent tanpa error di WebView
//
// SOLUSI:
// - AudioContext unlock via gesture pertama
// - Format fallback: WebM > MP3 > OGG
// - Preloading dengan error handling
// - Queue audio untuk mencegah overlap
// ============================================================

const AudioManager = (() => {
  let masterVolume   = 0.8;
  let currentAudio   = null;
  let audioContext   = null;
  let isUnlocked     = false;
  let audioCache     = {};       // cache Audio objects
  let onEndCallback  = null;

  // ---- Format support detection ----
  const FORMAT_PRIORITY = ['webm', 'mp3', 'ogg'];

  function getSupportedFormat(formats) {
    const audio = new Audio();
    for (const fmt of formats) {
      const mimeMap = {
        webm: 'audio/webm; codecs="opus"',
        mp3:  'audio/mpeg',
        ogg:  'audio/ogg; codecs="vorbis"'
      };
      if (audio.canPlayType(mimeMap[fmt]) !== '') return fmt;
    }
    return formats[0]; // fallback ke format pertama
  }

  // ---- Unlock AudioContext (WAJIB di Android WebView) ----
  // Panggil saat event touch/click pertama
  function unlock() {
    if (isUnlocked) return;
    try {
      if (!audioContext) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioContext = new AC();
      }
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      // Putar silent audio untuk "membuka kunci" autoplay
      const silentAudio = new Audio();
      silentAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      silentAudio.volume = 0;
      const playPromise = silentAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isUnlocked = true;
          console.log('[Audio] Unlocked');
        }).catch(() => {});
      }
    } catch(e) {
      console.warn('[Audio] Unlock failed:', e);
    }
  }

  // ---- Build Audio object dengan format fallback ----
  function buildAudioSrc(basePath, formats) {
    const fmt = getSupportedFormat(formats);
    return `${basePath}.${fmt}`;
  }

  // ---- Preload audio ke cache ----
  function preload(basePath, formats) {
    const src = buildAudioSrc(basePath, formats);
    if (!audioCache[src]) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume  = masterVolume;
      audio.src     = src;
      audioCache[src] = audio;
    }
    return audioCache[src];
  }

  // ---- Play audio dengan Promise + queue ----
  // onEnd dipanggil saat audio selesai atau error (agar dialog tetap lanjut)
  function play(basePath, formats, onEnd) {
    setStatus('Memutar...', true);
    onEndCallback = onEnd || null;

    // Stop audio sebelumnya
    stop();

    const src = buildAudioSrc(basePath, formats);

    // Gunakan cache jika ada
    let audio = audioCache[src];
    if (!audio) {
      audio = new Audio();
      audio.src = src;
      audioCache[src] = audio;
    }

    audio.volume  = masterVolume;
    audio.currentTime = 0;

    currentAudio = audio;

    audio.onended = () => {
      setStatus('Selesai');
      currentAudio = null;
      if (onEndCallback) { onEndCallback(); onEndCallback = null; }
    };

    audio.onerror = (e) => {
      console.warn('[Audio] Error playing:', src, e);
      setStatus('Audio tidak ditemukan');
      currentAudio = null;
      // Lanjutkan dialog walau audio gagal (agar tidak stuck)
      if (onEndCallback) { onEndCallback(); onEndCallback = null; }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[Audio] Play blocked:', err);
        // Coba unlock dan retry sekali
        unlock();
        setTimeout(() => {
          audio.play().catch(() => {
            setStatus('Audio diblokir browser');
            if (onEndCallback) { onEndCallback(); onEndCallback = null; }
          });
        }, 300);
      });
    }
  }

  // ---- Stop audio yang sedang berjalan ----
  function stop() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio = null;
    }
    onEndCallback = null;
  }

  // ---- Volume ----
  function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
    if (currentAudio) currentAudio.volume = masterVolume;
    document.getElementById('vol-label').textContent = Math.round(v * 100) + '%';
  }

  // ---- Status UI ----
  function setStatus(text, loading = false) {
    const el = document.getElementById('audio-status-text');
    if (el) el.textContent = loading ? '⏳ ' + text : text;
  }

  // ---- Test audio (untuk debug) ----
  function testAudio() {
    unlock();
    const beep = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAA'
      + 'ABAAEARKwAAIhYAQACABAAAABkYXRhQG8AAAAAAA==');
    beep.volume = masterVolume;
    beep.play().then(() => {
      GameApp.showToast('✅ Audio berfungsi!');
    }).catch(() => {
      GameApp.showToast('⚠️ Audio diblokir — sentuh layar dulu');
    });
  }

  // ---- Unlock saat sentuh layar ----
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
  document.addEventListener('click',      unlock, { once: true });

  return { play, stop, preload, setVolume, testAudio, unlock, setStatus };
})();