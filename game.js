// ============================================================
// game.js — Controller utama Legal Royale
// ============================================================

const GameApp = (() => {
  let subtitleEnabled = true;
  let selectedCase    = null;
  let toastTimer      = null;

  // ---- Navigasi Layar ----
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }
    // Inisialisasi layar saat dibuka
    if (id === 'screen-characters') renderCharacters();
    if (id === 'screen-cases')      renderCases();
    if (id === 'screen-glossary')   renderGlossary('');
    if (id === 'screen-tutorial')   renderTutorial();
    if (id === 'screen-courtroom')  initCourtroom();
  }

  // ---- Inisialisasi Ruang Sidang ----
  function initCourtroom() {
    renderCharChips();
    if (selectedCase) {
      DialogManager.loadSession(selectedCase);
    } else {
      const textEl = document.getElementById('dialog-text');
      if (textEl) textEl.textContent = '⚠️ Pilih kasus dulu di menu "Pilih Kasus", lalu kembali ke sini.';
    }
  }

  // ---- Render chip karakter di Ruang Sidang ----
  function renderCharChips() {
    const grid = document.getElementById('char-selector-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.values(CHARACTERS).forEach(char => {
      const chip = document.createElement('div');
      chip.className = 'char-chip';
      chip.dataset.charId = char.id;
      chip.innerHTML = `
        <div class="char-chip-icon">${char.icon}</div>
        <div class="char-chip-label">${char.role}</div>
      `;
      // Ketuk chip → putar audio intro karakter
      chip.addEventListener('click', () => {
        AudioManager.unlock();
        DialogManager.playCharVoice(char.id, 'intro');
      });
      grid.appendChild(chip);
    });
  }

  // ---- Render halaman karakter ----
  function renderCharacters() {
    const list = document.getElementById('characters-list');
    if (!list) return;
    list.innerHTML = '';
    Object.values(CHARACTERS).forEach(char => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div class="char-card-icon">${char.icon}</div>
        <div class="char-card-body">
          <div class="char-card-name">${char.name}</div>
          <div class="char-card-role">${char.role}</div>
          <div class="char-card-desc">${char.desc}</div>
        </div>
        <button class="char-card-play-btn" data-char="${char.id}">🔊 Suara</button>
      `;
      card.querySelector('.char-card-play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        AudioManager.unlock();
        DialogManager.playCharVoice(char.id, 'intro');
        showToast(`🔊 Memutar voice-over ${char.name}`);
      });
      list.appendChild(card);
    });
  }

  // ---- Render daftar kasus ----
  function renderCases() {
    const list = document.getElementById('cases-list');
    if (!list) return;
    list.innerHTML = '';
    Object.entries(COURT_SESSIONS).forEach(([key, session]) => {
      const card = document.createElement('div');
      card.className = 'case-card' + (selectedCase === key ? ' selected' : '');
      card.innerHTML = `
        <div class="case-number">${session.number}</div>
        <div class="case-title">${session.title}</div>
        <div class="case-desc">${session.dialogs.length} dialog · Klik untuk memilih</div>
        <div class="case-tags">
          ${session.dialogs.map(d => CHARACTERS[d.charId]?.role || '').filter((v,i,a)=>a.indexOf(v)===i)
            .map(r => `<span class="case-tag">${r}</span>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm case-btn" data-key="${key}">
          ${selectedCase === key ? '✅ Dipilih' : '▶ Pilih Kasus Ini'}
        </button>
      `;
      card.querySelector('.case-btn').addEventListener('click', () => {
        selectedCase = key;
        showToast('✅ Kasus dipilih: ' + session.title);
        renderCases(); // re-render untuk update selected state
      });
      list.appendChild(card);
    });
  }

  // ---- Render glosarium ----
  function renderGlossary(filter) {
    const list = document.getElementById('glossary-list');
    if (!list) return;
    const q = (filter || '').toLowerCase();
    const data = q
      ? GLOSSARY_DATA.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q))
      : GLOSSARY_DATA;
    list.innerHTML = '';
    data.forEach(g => {
      const item = document.createElement('div');
      item.className = 'glossary-item';
      item.innerHTML = `
        <div class="glossary-term">${g.term}</div>
        <div class="glossary-def">${g.def}</div>
      `;
      item.addEventListener('click', () => item.classList.toggle('open'));
      list.appendChild(item);
    });
    if (!data.length) {
      list.innerHTML = '<div style="padding:20px;color:var(--c-muted);text-align:center">Tidak ditemukan</div>';
    }
  }

  function filterGlossary(val) { renderGlossary(val); }

  // ---- Render tutorial ----
  function renderTutorial() {
    const cont = document.getElementById('tutorial-content');
    if (!cont) return;
    cont.innerHTML = TUTORIAL_STEPS.map(s => `
      <div class="tutorial-step">
        <div class="step-num">${s.num}</div>
        <div class="step-body">
          <strong>${s.title}</strong>
          <p>${s.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // ---- Toggle subtitle ----
  function toggleSubtitle(btn) {
    subtitleEnabled = !subtitleEnabled;
    if (btn) {
      btn.textContent = subtitleEnabled ? 'ON' : 'OFF';
      btn.classList.toggle('off', !subtitleEnabled);
    }
    showToast('Subtitle: ' + (subtitleEnabled ? 'ON' : 'OFF'));
  }

  // ---- Toast notifikasi ----
  function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.remove('hidden', 'fade-out');
    toastTimer = setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, duration);
  }

  // ---- Loading overlay ----
  function showLoading(show) {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.toggle('hidden', !show);
  }

  // ---- Init saat DOMContentLoaded ----
  document.addEventListener('DOMContentLoaded', () => {
    // Cegah context menu panjang di mobile (terasa lebih native)
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Cegah selection text saat tap kartu
    document.addEventListener('selectstart', e => {
      if (e.target.closest('.menu-card, .char-chip, .char-card')) e.preventDefault();
    });

    showScreen('screen-splash');
    console.log('[Legal Royale] Game initialized');
  });

  return { showScreen, showToast, showLoading, filterGlossary, toggleSubtitle };
})();