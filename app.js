/**
 * Tautos Bukiausias 2026 – TV3 Balsavimo Platforma
 * Client State, Idempotent DOM Rendering, and Cloud Sync.
 * Clean, lightweight, zero-bloat standard.
 */

const CLOUD_SYNC_URL = "https://api.restful-api.dev/objects/ff808181a067127101a08072620147f6";
const LOCAL_STORAGE_KEY = "tautos_bukiausias_v3_state";

// Initial Researched TV Show Contestants (TV3 2026)
const DEFAULT_CONTESTANTS = [
  {
    id: "oksana",
    name: "Oksana Pikul",
    alias: "„Oksana Pikel“",
    tagline: "Eterio titruose virto „Pikel“, o Neilą Armstrongą supainiojo su Gagarinu Mėnulyje!",
    avatar: "💄",
    category: "pupil",
    categoryLabel: "Mados & Titrų Auka"
  },
  {
    id: "ausra",
    name: "Aušra Maldeikienė",
    alias: "„Brandas Maldeikienė (Seibutytė)“",
    tagline: "„Aš už nieką neatsakinga, aš galiu būti pati bukiausia, man dzin!“",
    avatar: "💶",
    category: "pupil",
    categoryLabel: "Ekonominė Filosofija"
  },
  {
    id: "simona",
    name: "Simona Lipnė",
    alias: "„Greit Nebe Lipnė“",
    tagline: "Trynukų mama ir eterio žvaigždė: „Lionei net konkurso nereikia, ana jau bukiausia“",
    avatar: "👶",
    category: "pupil",
    categoryLabel: "Influencerių Katedra"
  },
  {
    id: "danas",
    name: "Danas Rapšys",
    alias: "„Vandens Profesorius“",
    tagline: "Per pamokas slapčia valgė bandeles, o vandens paslaptys vis dar neįmintos!",
    avatar: "🏊",
    category: "pupil",
    categoryLabel: "Olimpinis Plaukimas"
  },
  {
    id: "zilvinas",
    name: "Žilvinas Grigaitis",
    alias: "„Šampano ir Lėktuvų Lordas“",
    tagline: "Lėktuvuose praleido pusę gyvenimo, mados ir sagų ekspertas bet kokiu oru.",
    avatar: "🥂",
    category: "pupil",
    categoryLabel: "Pasaulio Elitas"
  },
  {
    id: "ineta",
    name: "Ineta Stasiulytė",
    alias: "„Nežinojimo Deivė“",
    tagline: "Aistringa tango šokėja: „Faktų nežinojimas nė vieno nepaverčia blogu žmogumi!“",
    avatar: "💃",
    category: "pupil",
    categoryLabel: "Teatras & Šokiai"
  },
  {
    id: "ironvytas",
    name: "Vytautas Medineckas (Ironvytas)",
    alias: "„Dvi Pažymių Knygelės“",
    tagline: "3 metus turėjo 2 pažymių knygeles (vieną mamai, kitą mokytojams) ir 120 kg raumenų.",
    avatar: "💪",
    category: "pupil",
    categoryLabel: "Raumenų Reperis"
  },
  {
    id: "gabrielius",
    name: "Gabrielius Vagelis",
    alias: "„Mados Kankinys“",
    tagline: "Švarkai gigantiški, plaukai nepajudinami, o atsakymų ieškoma stiliuje.",
    avatar: "🎤",
    category: "pupil",
    categoryLabel: "Pop Scenos Auka"
  },
  {
    id: "agne",
    name: "Agnė Turskienė",
    alias: "„Maldeikienės Marti“",
    tagline: "Kibernetinio saugumo specialistė, bet anytos temperamento nesuvaldė.",
    avatar: "🛡️",
    category: "pupil",
    categoryLabel: "IT & Šeimyninė Karma"
  },
  {
    id: "kaniusonis",
    name: "Vytautas Kaniušonis",
    alias: "„Amžinas Avantiūristas“",
    tagline: "Teatro vilkas, kuris sutiko dalyvauti vos išgirdęs žodį „bukiausias“.",
    avatar: "🎩",
    category: "pupil",
    categoryLabel: "Kino Grandas"
  },
  {
    id: "joana",
    name: "Joana Bartaškienė",
    alias: "„58 Metai Aerobikos“",
    tagline: "Tikra energijos bomba: „Meilė gyvenimui į pensiją neina, smegenis pamaitinsim!“",
    avatar: "⚡",
    category: "pupil",
    categoryLabel: "Sporto Legenda"
  },
  {
    id: "rumsas",
    name: "Vytautas Rumšas Jr.",
    alias: "„Grimas Nepadės“",
    tagline: "„Jeigu esi durnas – joks TV grimas čia nepadės!“",
    avatar: "📺",
    category: "pupil",
    categoryLabel: "TV Vedėjų Elitas"
  },
  {
    id: "katleris",
    name: "Mantas Katleris (Mokytojas)",
    alias: "„Klasės Valandėlės Pirmūnas“",
    tagline: "Tikybos pamokų bėglys ir klasės valandėlių lyderis.",
    avatar: "👨‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  },
  {
    id: "bartusevicius",
    name: "Mantas Bartuševičius (Mokytojas)",
    alias: "„Penktoko Matematika“",
    tagline: "Matematikos žinių turi lygiai tiek pat, kiek penktokas per vasaros atostogas.",
    avatar: "🧑‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  }
];

// Application State
let appState = {
  contestants: [...DEFAULT_CONTESTANTS],
  votes: {
    oksana: 6,
    ausra: 5,
    simona: 7,
    danas: 3,
    zilvinas: 4,
    ineta: 2,
    ironvytas: 5,
    gabrielius: 3,
    agne: 2,
    kaniusonis: 2,
    joana: 2,
    rumsas: 6,
    katleris: 3,
    bartusevicius: 4
  },
  voterLedger: [
    { voter: "Mantas K.", choices: ["oksana", "rumsas", "simona"], timestamp: "11:30" },
    { voter: "Karolis", choices: ["simona", "ausra", "ironvytas"], timestamp: "12:15" },
    { voter: "Monika", choices: ["oksana", "zilvinas", "gabrielius"], timestamp: "12:40" }
  ],
  selectedCandidates: new Set(),
  activeFilter: "all",
  searchQuery: "",
  isSyncing: false
};

// ==========================================================================
// Cloud Sync Logic
// ==========================================================================
async function fetchCloudState() {
  try {
    const response = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Cloud fetch status: " + response.status);
    const result = await response.json();
    if (result && result.data) {
      mergeCloudData(result.data);
    }
  } catch (err) {
    loadLocalFallback();
  }
}

async function pushCloudState() {
  appState.isSyncing = true;
  saveLocalFallback();

  const payload = {
    name: "Lietuvos_Bukiausias_Sync",
    data: {
      votes: appState.votes,
      customContestants: appState.contestants.filter(c => c.category === "custom"),
      voterLedger: appState.voterLedger
    }
  };

  try {
    await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Offline state saved locally:", err);
  } finally {
    appState.isSyncing = false;
  }
}

function mergeCloudData(cloudData) {
  if (cloudData.votes) {
    appState.votes = { ...appState.votes, ...cloudData.votes };
  }
  if (Array.isArray(cloudData.voterLedger)) {
    appState.voterLedger = cloudData.voterLedger;
  }
  if (Array.isArray(cloudData.customContestants)) {
    cloudData.customContestants.forEach(customC => {
      if (!appState.contestants.some(c => c.id === customC.id)) {
        appState.contestants.push(customC);
      }
    });
  }
  saveLocalFallback();
  renderAll();
}

function saveLocalFallback() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      votes: appState.votes,
      voterLedger: appState.voterLedger,
      contestants: appState.contestants
    }));
  } catch (e) {}
}

function loadLocalFallback() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.votes) appState.votes = parsed.votes;
      if (parsed.voterLedger) appState.voterLedger = parsed.voterLedger;
      if (Array.isArray(parsed.contestants) && parsed.contestants.length > 0) {
        appState.contestants = parsed.contestants;
      }
      renderAll();
    }
  } catch (e) {}
}

// ==========================================================================
// Central Rendering Engine (Idempotent)
// ==========================================================================
function renderAll() {
  renderLeaderboard();
  renderContestants();
  renderActivity();
  updateDockControls();
}

// Top Section: Live Horizontal Leaderboard
function renderLeaderboard() {
  const container = document.getElementById("leaderboardList");
  if (!container) return;

  const contestantsWithVotes = appState.contestants.map(c => ({
    ...c,
    voteCount: appState.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = Object.values(appState.votes).reduce((sum, v) => sum + v, 0) || 1;

  container.innerHTML = contestantsWithVotes.map((c, idx) => {
    const rank = idx + 1;
    const rankClass = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : ''));
    const pct = Math.round((c.voteCount / totalVotes) * 100);
    const voteText = `${c.voteCount} ${c.voteCount === 1 ? 'balsas' : 'balsų'}`;

    return `
      <div class="leaderboard-row ${rankClass}">
        <span class="leaderboard-rank">#${rank}</span>
        <span class="leaderboard-avatar">${c.avatar}</span>
        <div class="leaderboard-details">
          <div class="leaderboard-names">
            <span class="leaderboard-name">${escapeHTML(c.name)}</span>
            <span class="leaderboard-alias">${escapeHTML(c.alias)}</span>
          </div>
          <div class="leaderboard-bar-track">
            <div class="leaderboard-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
        <div class="leaderboard-stats">
          <div class="leaderboard-votes">${c.voteCount}</div>
          <div class="leaderboard-pct">${pct}%</div>
        </div>
      </div>
    `;
  }).join("");
}

// Middle Section: Contestant Cards Roster
function renderContestants() {
  const grid = document.getElementById("contestantsGrid");
  if (!grid) return;

  const query = appState.searchQuery.toLowerCase();
  const filtered = appState.contestants.filter(c => {
    const matchesCategory = appState.activeFilter === "all" || c.category === appState.activeFilter;
    const matchesSearch = !query || 
      c.name.toLowerCase().includes(query) ||
      c.alias.toLowerCase().includes(query) ||
      c.tagline.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const totalCountEl = document.getElementById("totalContestantsCount");
  if (totalCountEl) totalCountEl.textContent = appState.contestants.length;

  const isMaxReached = appState.selectedCandidates.size >= 3;

  grid.innerHTML = filtered.map(c => {
    const isSelected = appState.selectedCandidates.has(c.id);
    const isDisabled = !isSelected && isMaxReached;
    const voteCount = appState.votes[c.id] || 0;
    const voteLabel = `${voteCount} ${voteCount === 1 ? 'balsas' : 'balsai'}`;

    return `
      <article 
        class="contestant-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
        data-id="${c.id}"
        tabindex="${isDisabled ? '-1' : '0'}"
        role="button"
        aria-pressed="${isSelected}"
        aria-label="${escapeHTML(c.name)}, ${voteLabel}"
      >
        <div class="card-top">
          <span class="card-avatar">${c.avatar}</span>
          <span class="card-check">${isSelected ? '✓' : ''}</span>
        </div>
        <div class="card-body">
          <div class="card-category-tag">${escapeHTML(c.categoryLabel || 'Kandidatas')}</div>
          <h3 class="contestant-name">${escapeHTML(c.name)}</h3>
          <div class="contestant-alias">${escapeHTML(c.alias)}</div>
          <p class="contestant-tagline">${escapeHTML(c.tagline)}</p>
        </div>
        <div class="card-footer">
          <span class="card-vote-count">${voteLabel}</span>
          <span class="card-action-status">${isSelected ? 'Pasirinkta' : (isDisabled ? 'Laisvų vietų: 0' : 'Pasirinkti')}</span>
        </div>
      </article>
    `;
  }).join("");

  // Card click & keyboard selection handlers
  grid.querySelectorAll(".contestant-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      toggleCandidate(id);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const id = card.getAttribute("data-id");
        toggleCandidate(id);
      }
    });
  });
}

function toggleCandidate(id) {
  if (appState.selectedCandidates.has(id)) {
    appState.selectedCandidates.delete(id);
  } else {
    if (appState.selectedCandidates.size >= 3) {
      showToast("Daugiausiai galima pasirinkti 3 kandidatus!", "toast-error");
      return;
    }
    appState.selectedCandidates.add(id);
  }

  updateDockControls();
  renderContestants();
}

function updateDockControls() {
  const selectedCount = appState.selectedCandidates.size;
  const countEl = document.getElementById("selectedCount");
  const instructionEl = document.getElementById("counterInstruction");
  const submitBtn = document.getElementById("submitVoteBtn");
  const dock = document.getElementById("votingDock");
  const voterName = (document.getElementById("voterNameInput")?.value || "").trim();

  if (countEl) countEl.textContent = selectedCount;

  if (instructionEl) {
    if (selectedCount === 0) instructionEl.textContent = "Iki 3 kandidatų";
    else if (selectedCount === 1) instructionEl.textContent = "Galite pasirinkti dar 2";
    else if (selectedCount === 2) instructionEl.textContent = "Galite pasirinkti dar 1";
    else instructionEl.textContent = "Pasirinkta norma (3 iš 3)";
  }

  if (dock) {
    if (selectedCount > 0) dock.classList.add("active");
    else dock.classList.remove("active");
  }

  if (submitBtn) {
    submitBtn.disabled = !(selectedCount > 0 && voterName.length >= 2);
  }
}

// Bottom Section: Recent Activity / Audit Feed
function renderActivity() {
  const listEl = document.getElementById("activityList");
  const emptyMsg = document.getElementById("emptyActivityMsg");
  const totalBadge = document.getElementById("totalVotersBadge");
  if (!listEl) return;

  const ledger = [...appState.voterLedger].reverse();

  if (totalBadge) {
    totalBadge.textContent = `Balsavo: ${ledger.length}`;
  }

  if (ledger.length === 0) {
    listEl.innerHTML = "";
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");

  listEl.innerHTML = ledger.slice(0, 15).map(item => {
    const candidateChips = item.choices.map(id => {
      const c = appState.contestants.find(cand => cand.id === id);
      return `<span class="choice-chip">${c ? c.avatar + ' ' + escapeHTML(c.name) : id}</span>`;
    }).join("");

    return `
      <div class="activity-item">
        <div class="activity-voter-info">
          <span class="activity-time">${escapeHTML(item.timestamp || '')}</span>
          <span class="activity-voter-name">${escapeHTML(item.voter)}</span>
        </div>
        <div class="activity-choices">
          ${candidateChips}
        </div>
      </div>
    `;
  }).join("");
}

// Vote Submission
async function handleVoteSubmit() {
  const voterNameInput = document.getElementById("voterNameInput");
  const voterName = (voterNameInput?.value || "").trim();

  if (!voterName || voterName.length < 2) {
    showToast("Įveskite savo vardą balsavimui!", "toast-error");
    voterNameInput?.focus();
    return;
  }

  if (appState.selectedCandidates.size === 0) {
    showToast("Pasirinkite bent 1 kandidatą!", "toast-error");
    return;
  }

  const selectedIds = Array.from(appState.selectedCandidates);

  // Increment votes
  selectedIds.forEach(id => {
    appState.votes[id] = (appState.votes[id] || 0) + 1;
  });

  // Timestamp
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Prepend to ledger
  appState.voterLedger.push({
    voter: voterName,
    choices: selectedIds,
    timestamp: timeStr
  });

  // Subtle confetti victory burst (respecting reduced-motion)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof confetti === "function") {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#D97706', '#FFFFFF']
    });
  }

  // Clear selections
  appState.selectedCandidates.clear();
  updateDockControls();
  renderAll();

  showToast(`Ačiū, ${voterName}! Tavo balsas sėkmingai užfiksuotas.`, "toast-success");

  // Push to cloud in background
  await pushCloudState();
}

// Add Custom Contestant
async function handleAddContestant(e) {
  e.preventDefault();
  const nameInput = document.getElementById("newCandidateName");
  const aliasInput = document.getElementById("newCandidateAlias");
  const taglineInput = document.getElementById("newCandidateTagline");
  const emojiInput = document.getElementById("selectedEmoji");

  const name = nameInput.value.trim();
  const alias = aliasInput.value.trim();
  const tagline = taglineInput.value.trim();
  const avatar = emojiInput.value || "🤡";

  if (!name || !alias || !tagline) return;

  const newId = "custom_" + Date.now().toString(36);
  const newCandidate = {
    id: newId,
    name: name,
    alias: alias.startsWith("„") ? alias : `„${alias}“`,
    tagline: tagline,
    avatar: avatar,
    category: "custom",
    categoryLabel: "Pasiūlytas Draugų"
  };

  appState.contestants.push(newCandidate);
  appState.votes[newId] = 1;

  closeAddModal();
  renderAll();
  showToast(`${name} įtrauktas į kandidatų sąrašą!`, "toast-success");

  await pushCloudState();
}

// Toast Helper
function showToast(message, type = "toast-success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'scale(0.95)';
    setTimeout(() => toast.remove(), 220);
  }, 3500);
}

function escapeHTML(str) {
  return String(str || "").replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function openAddModal() {
  document.getElementById("addContestantModal")?.classList.remove("hidden");
  document.getElementById("newCandidateName")?.focus();
}

function closeAddModal() {
  document.getElementById("addContestantModal")?.classList.add("hidden");
  document.getElementById("addContestantForm")?.reset();
}

// ==========================================================================
// Initialization & Event Listeners
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State Hydration & Cloud Sync
  loadLocalFallback();
  fetchCloudState();

  // Background quiet cloud sync every 10 seconds
  setInterval(() => {
    if (!appState.isSyncing) {
      fetchCloudState();
    }
  }, 10000);

  // 2. Voter Name Input & Submit
  const voterInput = document.getElementById("voterNameInput");
  voterInput?.addEventListener("input", updateDockControls);

  document.getElementById("submitVoteBtn")?.addEventListener("click", handleVoteSubmit);

  // 3. Category Filter Pills
  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeFilter = btn.getAttribute("data-category");
      renderContestants();
    });
  });

  // 4. Search Filter
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    appState.searchQuery = e.target.value;
    renderContestants();
  });

  // 5. Modal Dialog Events
  document.getElementById("openAddModalBtn")?.addEventListener("click", openAddModal);
  document.getElementById("closeModalBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("cancelAddBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("addContestantForm")?.addEventListener("submit", handleAddContestant);

  // Emoji Selector inside Modal
  document.querySelectorAll(".emoji-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const emojiInput = document.getElementById("selectedEmoji");
      if (emojiInput) emojiInput.value = btn.getAttribute("data-emoji");
    });
  });

  // 6. Reset Data (Discrete test reset in footer)
  document.getElementById("resetDataBtn")?.addEventListener("click", () => {
    if (confirm("Ar tikrai norite atstatyti visus balsus ir pradėti iš naujo?")) {
      appState.votes = {};
      DEFAULT_CONTESTANTS.forEach(c => appState.votes[c.id] = 0);
      appState.voterLedger = [];
      saveLocalFallback();
      pushCloudState();
      renderAll();
      showToast("Visi balsai sėkmingai atstatyti.", "toast-success");
    }
  });

  // Initial render
  renderAll();
});
