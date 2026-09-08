/**
 * Tautos Bukiausias 2026 – TV3 Balsavimo Platforma
 * Client Logic, Cloud Sync, Chart Engine & Sound Effects
 */

// Cloud Sync Endpoint (api.restful-api.dev shared cloud object)
const CLOUD_SYNC_URL = "https://api.restful-api.dev/objects/ff808181a067127101a08072620147f6";
const LOCAL_STORAGE_KEY = "tautos_bukiausias_v3_state";

// Initial Researched TV Show Contestants (TV3 2026)
const DEFAULT_CONTESTANTS = [
  {
    id: "oksana",
    name: "Oksana Pikul",
    alias: "„Oksana Pikel“",
    tagline: "Eterio titruose virto „Pikel“, o Neilą Armstrongą supainiojo su Gagarinu Mėnulyje! 🚀",
    avatar: "💄",
    category: "pupil",
    categoryLabel: "Mados & Titrų Auka"
  },
  {
    id: "ausra",
    name: "Aušra Maldeikienė",
    alias: "„Brandas Maldeikienė (Seibutytė)“",
    tagline: "„Aš už nieką neatsakinga, aš galiu būti pati bukiausia, man dzin!“ 📢",
    avatar: "💶",
    category: "pupil",
    categoryLabel: "Ekonominė Filosofija"
  },
  {
    id: "simona",
    name: "Simona Lipnė",
    alias: "„Greit Nebe Lipnė“",
    tagline: "Trynukų mama ir eterio žvaigždė: „Lionei net konkurso nereikia, ana jau bukiausia“ 🛍️",
    avatar: "👶",
    category: "pupil",
    categoryLabel: "Influencerių Katedra"
  },
  {
    id: "danas",
    name: "Danas Rapšys",
    alias: "„Vandens Profesorius“",
    tagline: "Per pamokas slapčia valgė bandeles, o vandens paslaptys vis dar neįmintos! 🥐",
    avatar: "🏊",
    category: "pupil",
    categoryLabel: "Olimpinis Plaukimas"
  },
  {
    id: "zilvinas",
    name: "Žilvinas Grigaitis",
    alias: "„Šampano ir Lėktuvų Lordas“",
    tagline: "Lėktuvuose praleido pusę gyvenimo, mados ir sagų ekspertas bet kokiu oru 🍾",
    avatar: "🥂",
    category: "pupil",
    categoryLabel: "Pasaulio Elitas"
  },
  {
    id: "ineta",
    name: "Ineta Stasiulytė",
    alias: "„Nežinojimo Deivė“",
    tagline: "Aistringa tango šokėja: „Faktų nežinojimas nė vieno nepaverčia blogu žmogumi!“ 💃",
    avatar: "🎭",
    category: "pupil",
    categoryLabel: "Teatras & Šokiai"
  },
  {
    id: "ironvytas",
    name: "Vytautas Medineckas (Ironvytas)",
    alias: "„Dvi Pažymių Knygelės“",
    tagline: "3 metus turėjo 2 pažymių knygeles (vieną mamai, kitą mokytojams) ir 120 kg raumenų 🏋️",
    avatar: "💪",
    category: "pupil",
    categoryLabel: "Raumenų Reperis"
  },
  {
    id: "gabrielius",
    name: "Gabrielius Vagelis",
    alias: "„Mados Kankinys“",
    tagline: "Švarkai gigantiški, plaukai nepajudinami, o atsakymų ieškoma stiliuje 🧥",
    avatar: "🎤",
    category: "pupil",
    categoryLabel: "Pop Scenos Auka"
  },
  {
    id: "agne",
    name: "Agnė Turskienė",
    alias: "„Maldeikienės Marti“",
    tagline: "Kibernetinio saugumo specialistė, bet anytos temperamento nesuvaldė 💻",
    avatar: "🛡️",
    category: "pupil",
    categoryLabel: "IT & Šeimyninė Karma"
  },
  {
    id: "kaniusonis",
    name: "Vytautas Kaniušonis",
    alias: "„Amžinas Avantiūristas“",
    tagline: "Teatro vilkas, kuris sutiko dalyvauti vos išgirdęs žodį „bukiausias“ 🎬",
    avatar: "🎩",
    category: "pupil",
    categoryLabel: "Kino Grandas"
  },
  {
    id: "joana",
    name: "Joana Bartaškienė",
    alias: "„58 Metai Aerobikos“",
    tagline: "Tikra energijos bomba: „Meilė gyvenimui į pensiją neina, smegenis pamaitinsim!“ 🤸",
    avatar: "⚡",
    category: "pupil",
    categoryLabel: "Sporto Legenda"
  },
  {
    id: "rumsas",
    name: "Vytautas Rumšas Jr.",
    alias: "„Grimas Nepadės“",
    tagline: "„Jeigu esi durnas – joks TV grimas čia nepadės!“ 🤡",
    avatar: "📺",
    category: "pupil",
    categoryLabel: "TV Vedėjų Elitas"
  },
  {
    id: "katleris",
    name: "Mantas Katleris (Mokytojas)",
    alias: "„Klasės Valandėlės Pirmūnas“",
    tagline: "Tikybos pamokų bėglys ir klasės valandėlių lyderis 🍺",
    avatar: "👨‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  },
  {
    id: "bartusevicius",
    name: "Mantas Bartuševičius (Mokytojas)",
    alias: "„Penktoko Matematika“",
    tagline: "Matematikos žinių turi lygiai tiek pat, kiek penktokas per vasaros atostogas 📐",
    avatar: "🧑‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  }
];

// Funny random voter nicknames generator
const RANDOM_NICKNAMES = [
  "Klasės Genijus", "Kaimo Einšteinas", "Gudrusis Karolis", "Trolių Karalienė",
  "TV3 Žiūrovas", "Bandelės Fanatikas", "Anoniminis Bukius", "Pirmūnas Be Diplomo",
  "Dunce Karalius", "Manto Katlerio Pusbrolis", "Tango Ekspertas", "Mėnulio Gagarinas"
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
    { voter: "Mantas K.", choices: ["oksana", "rumsas", "simona"], timestamp: "2026-09-08 11:30", note: "Klasės lyderiai!" },
    { voter: "Karolis", choices: ["simona", "ausra", "ironvytas"], timestamp: "2026-09-08 12:15", note: "Dėl 2 pažymių knygelių" },
    { voter: "Monika", choices: ["oksana", "zilvinas", "gabrielius"], timestamp: "2026-09-08 12:40", note: "Stilius ir Gagarinai" }
  ],
  selectedCandidates: new Set(),
  activeFilter: "all",
  searchQuery: "",
  viewMode: "columns", // 'columns' | 'list'
  soundEnabled: true,
  isSyncing: false
};

// Simple Web Audio API Synthesizer (No external mp3 needed!)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'select') {
      // High bright blip
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'unselect') {
      // Lower slide down
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'vote') {
      // Cheerful fanfare chord
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now + i * 0.05);
        g.gain.setValueAtTime(0.15, now + i * 0.05);
        g.gain.linearRampToValueAtTime(0.01, now + i * 0.05 + 0.35);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + i * 0.05);
        o.stop(now + i * 0.05 + 0.4);
      });
    } else if (type === 'warn') {
      // Boing buzzer
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.log("Audio not supported or blocked", e);
  }
}

// ==========================================================================
// Cloud Sync Logic
// ==========================================================================
async function fetchCloudState() {
  setSyncStatus("🟡 Tikrinamas debesis...", "pending");
  try {
    const response = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Cloud fetch failed: " + response.status);
    const data = await response.json();
    if (data && data.data) {
      mergeCloudData(data.data);
      setSyncStatus("🟢 Debesis: Sinchronizuota", "success");
    }
  } catch (err) {
    console.warn("Could not reach cloud storage, using local cache:", err);
    setSyncStatus("🟠 Veikia vietiškai (Atsarginis)", "offline");
    loadLocalFallback();
  }
}

async function pushCloudState() {
  appState.isSyncing = true;
  setSyncStatus("⏳ Išsaugoma debesyje...", "pending");
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
    const response = await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Cloud put failed: " + response.status);
    setSyncStatus("🟢 Debesis: Išsaugota tiesiogiai", "success");
  } catch (err) {
    console.error("Cloud push error:", err);
    setSyncStatus("🟠 Išsaugota vietiškai (Debesis nepasiekiamas)", "offline");
  } finally {
    appState.isSyncing = false;
  }
}

function mergeCloudData(cloudData) {
  if (cloudData.votes) {
    appState.votes = { ...appState.votes, ...cloudData.votes };
  }
  if (cloudData.voterLedger && Array.isArray(cloudData.voterLedger)) {
    appState.voterLedger = cloudData.voterLedger;
  }
  if (cloudData.customContestants && Array.isArray(cloudData.customContestants)) {
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
      if (parsed.contestants && parsed.contestants.length > 0) {
        appState.contestants = parsed.contestants;
      }
      renderAll();
    }
  } catch (e) {}
}

function setSyncStatus(text, type) {
  const el = document.getElementById("syncStatusText");
  const dot = document.querySelector(".live-dot");
  if (el) el.textContent = text;
  if (dot) {
    dot.style.background = type === "success" ? "var(--color-cyan)" : (type === "pending" ? "var(--color-gold)" : "var(--color-orange)");
    dot.style.boxShadow = `0 0 10px ${dot.style.background}`;
  }
}

// ==========================================================================
// Rendering Engine
// ==========================================================================
function renderAll() {
  renderContestants();
  renderTicker();
  renderAnalytics();
  renderLedger();
  updateSelectionControls();
}

// Render Contestant Cards
function renderContestants() {
  const grid = document.getElementById("contestantsGrid");
  if (!grid) return;

  const filtered = appState.contestants.filter(c => {
    const matchesCategory = appState.activeFilter === "all" || c.category === appState.activeFilter;
    const matchesSearch = !appState.searchQuery || 
      c.name.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(appState.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCountEl = document.getElementById("totalContestantsCount");
  if (totalCountEl) totalCountEl.textContent = appState.contestants.length;

  const isMaxReached = appState.selectedCandidates.size >= 3;

  grid.innerHTML = filtered.map(c => {
    const isSelected = appState.selectedCandidates.has(c.id);
    const isDisabled = !isSelected && isMaxReached;
    const voteCount = appState.votes[c.id] || 0;

    return `
      <article 
        class="contestant-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
        data-id="${c.id}"
        tabindex="0"
        role="button"
        aria-pressed="${isSelected}"
      >
        <div class="card-top">
          <div class="avatar-wrapper">${c.avatar}</div>
          <div class="card-select-checkbox">${isSelected ? '✓' : ''}</div>
        </div>
        <div class="card-meta">
          <span class="category-tag">${c.categoryLabel || 'Kandidatas'}</span>
          <h3 class="contestant-name">${c.name}</h3>
          <div class="contestant-alias">${c.alias}</div>
          <p class="contestant-tagline">${c.tagline}</p>
        </div>
        <div class="card-footer">
          <span class="vote-count-badge">🗳️ ${voteCount} ${voteCount === 1 ? 'balsas' : 'balsai'}</span>
          <span class="pick-action-hint">${isSelected ? 'Pasirinkta' : (isDisabled ? 'Laisvų vietų: 0' : 'Pasirinkti')}</span>
        </div>
      </article>
    `;
  }).join("");

  // Attach card click handlers
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
    playSound('unselect');
  } else {
    if (appState.selectedCandidates.size >= 3) {
      playSound('warn');
      showToast("⚠️ Daugiausiai galima pasirinkti 3 kandidatus!", "toast-error");
      return;
    }
    appState.selectedCandidates.add(id);
    playSound('select');
  }

  updateSelectionControls();
  renderContestants();
}

function updateSelectionControls() {
  const selectedCount = appState.selectedCandidates.size;
  const countDisplay = document.getElementById("selectedCount");
  const instruction = document.getElementById("counterInstruction");
  const submitBtn = document.getElementById("submitVoteBtn");
  const voterName = (document.getElementById("voterNameInput")?.value || "").trim();
  const panelInner = document.querySelector(".control-panel-inner");

  if (countDisplay) countDisplay.textContent = selectedCount;

  if (instruction) {
    if (selectedCount === 0) instruction.textContent = "Pasirink iki 3 labiausiai nusipelniusių";
    else if (selectedCount === 1) instruction.textContent = "Gali pasirinkti dar 2 kandidatus";
    else if (selectedCount === 2) instruction.textContent = "Gali pasirinkti dar 1 kandidatą";
    else instruction.textContent = "🎉 Pasirinkta maksimali norma (3 iš 3)";
  }

  if (panelInner) {
    if (selectedCount > 0) panelInner.classList.add("active-selection");
    else panelInner.classList.remove("active-selection");
  }

  if (submitBtn) {
    // Disabled if 0 selected or name is empty
    const canSubmit = selectedCount > 0 && voterName.length >= 2;
    submitBtn.disabled = !canSubmit;
  }
}

// Render Results & Graph Columns
function renderAnalytics() {
  const contestantsWithVotes = appState.contestants.map(c => ({
    ...c,
    voteCount: appState.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = Object.values(appState.votes).reduce((sum, v) => sum + v, 0) || 1;
  const maxVotes = Math.max(...contestantsWithVotes.map(c => c.voteCount), 1);

  renderPodium(contestantsWithVotes);
  renderColumns(contestantsWithVotes, maxVotes, totalVotes);
  renderLeaderboardList(contestantsWithVotes, totalVotes);
}

// Top 3 Podium
function renderPodium(sortedContestants) {
  const podiumEl = document.getElementById("podiumContainer");
  if (!podiumEl) return;

  const top1 = sortedContestants[0] || { name: "Nėra", alias: "", voteCount: 0, avatar: "👑" };
  const top2 = sortedContestants[1] || { name: "Nėra", alias: "", voteCount: 0, avatar: "🥈" };
  const top3 = sortedContestants[2] || { name: "Nėra", alias: "", voteCount: 0, avatar: "🥉" };

  podiumEl.innerHTML = `
    <!-- 2nd Place -->
    <div class="podium-step podium-2">
      <div class="podium-avatar">${top2.avatar}</div>
      <div class="podium-name">${top2.name}</div>
      <div class="podium-alias">${top2.alias}</div>
      <div class="podium-box">
        <span class="podium-trophy">🎓</span>
        <span class="podium-rank">#2</span>
        <span class="podium-votes-count">${top2.voteCount} balsų</span>
      </div>
    </div>

    <!-- 1st Place (DUMBEST LEADER) -->
    <div class="podium-step podium-1">
      <div class="podium-avatar">${top1.avatar}</div>
      <div class="podium-name">${top1.name}</div>
      <div class="podium-alias">${top1.alias}</div>
      <div class="podium-box">
        <span class="podium-trophy">🚽👑</span>
        <span class="podium-rank">#1 BUKIAUSIAS</span>
        <span class="podium-votes-count">${top1.voteCount} balsų</span>
      </div>
    </div>

    <!-- 3rd Place -->
    <div class="podium-step podium-3">
      <div class="podium-avatar">${top3.avatar}</div>
      <div class="podium-name">${top3.name}</div>
      <div class="podium-alias">${top3.alias}</div>
      <div class="podium-box">
        <span class="podium-trophy">🥉</span>
        <span class="podium-rank">#3</span>
        <span class="podium-votes-count">${top3.voteCount} balsų</span>
      </div>
    </div>
  `;
}

// 3D Graph Columns
function renderColumns(sortedContestants, maxVotes, totalVotes) {
  const grid = document.getElementById("columnsGrid");
  if (!grid) return;

  grid.innerHTML = sortedContestants.map((c, idx) => {
    const pct = Math.round((c.voteCount / totalVotes) * 100);
    // Relative height from 10% to 92% of column grid
    const heightPct = Math.max(10, Math.round((c.voteCount / maxVotes) * 88));
    const isTop = idx === 0 && c.voteCount > 0;

    return `
      <div class="column-item" title="${c.name} (${c.alias}): ${c.voteCount} balsų (${pct}%)">
        <span class="column-pill-val">${c.voteCount}</span>
        <div class="column-bar ${isTop ? 'top-rank' : ''}" style="height: ${heightPct}%;"></div>
        <div class="column-label">
          <span class="column-avatar">${c.avatar}</span>
          <span class="column-name-abbr">${c.name.split(" ")[0]}</span>
          <span class="column-percent">${pct}%</span>
        </div>
      </div>
    `;
  }).join("");
}

// Leaderboard List
function renderLeaderboardList(sortedContestants, totalVotes) {
  const list = document.getElementById("leaderboardList");
  if (!list) return;

  list.innerHTML = sortedContestants.map((c, idx) => {
    const pct = Math.round((c.voteCount / totalVotes) * 100);
    return `
      <div class="leaderboard-item">
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="leaderboard-avatar">${c.avatar}</span>
        <div class="leaderboard-info">
          <div class="leaderboard-names">
            <span class="leaderboard-name">${c.name}</span>
            <span class="leaderboard-alias">${c.alias}</span>
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

// Render Voter Audit Ledger ("Kas už ką balsavo")
function renderLedger() {
  const tbody = document.getElementById("ledgerTableBody");
  const emptyMsg = document.getElementById("emptyLedgerMsg");
  const totalBadge = document.getElementById("totalVotersBadge");
  if (!tbody) return;

  const ledger = [...appState.voterLedger].reverse(); // Newest first

  if (totalBadge) {
    totalBadge.textContent = `Iš viso balsavo: ${ledger.length} draugų`;
  }

  if (ledger.length === 0) {
    tbody.innerHTML = "";
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("hidden");

  tbody.innerHTML = ledger.map(item => {
    const candidateBadges = item.choices.map(id => {
      const c = appState.contestants.find(cand => cand.id === id);
      return `<span class="choice-tag">${c ? c.avatar + ' ' + c.name : id}</span>`;
    }).join(" ");

    return `
      <tr>
        <td><small style="color: var(--text-muted);">${item.timestamp || 'ką tik'}</small></td>
        <td>
          <div class="voter-name-cell">
            <span class="voter-avatar-icon">👤</span>
            <span>${escapeHTML(item.voter)}</span>
          </div>
        </td>
        <td><div class="choices-badges">${candidateBadges}</div></td>
        <td><span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(item.note || 'Atidavė balsus')}</span></td>
      </tr>
    `;
  }).join("");
}

// News Ticker
function renderTicker() {
  const marquee = document.getElementById("tickerMarquee");
  if (!marquee) return;

  const topC = [...appState.contestants].sort((a, b) => (appState.votes[b.id] || 0) - (appState.votes[a.id] || 0))[0];
  const totalVoters = appState.voterLedger.length;

  marquee.innerHTML = `
    🔥 Naujausi reitingai: <strong>${topC.name} (${topC.alias})</strong> pirmauja kovoje dėl Tautos Bukiausio titulo su <strong>${appState.votes[topC.id] || 0} balsais!</strong> • Jau atiduota ${totalVoters} draugų balsų! • TV3 klasės mokytojai Katleris ir Bartuševičius šokiruoti!
  `;
}

// Submit Vote Handler
async function handleVoteSubmit() {
  const voterNameInput = document.getElementById("voterNameInput");
  const voterName = (voterNameInput?.value || "").trim();

  if (!voterName) {
    playSound('warn');
    showToast("⚠️ Įvesk savo vardą! Tai privaloma balsų apskaitai.", "toast-error");
    voterNameInput?.focus();
    return;
  }

  if (appState.selectedCandidates.size === 0) {
    playSound('warn');
    showToast("⚠️ Pasirink bent 1 kandidatą (iki 3)!", "toast-error");
    return;
  }

  const selectedIds = Array.from(appState.selectedCandidates);

  // Increment votes
  selectedIds.forEach(id => {
    appState.votes[id] = (appState.votes[id] || 0) + 1;
  });

  // Record in audit ledger
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  appState.voterLedger.push({
    voter: voterName,
    choices: selectedIds,
    timestamp: timeStr,
    note: `Atidavė ${selectedIds.length} ${selectedIds.length === 1 ? 'balsą' : 'balsus'}`
  });

  // Trigger celebration
  playSound('vote');
  triggerConfetti();

  // Clear selections
  appState.selectedCandidates.clear();
  updateSelectionControls();
  renderAll();

  showToast(`🎉 Ačiū, ${voterName}! Tavo balsai sėkmingai užfiksuoti!`, "toast-party");

  // Push to cloud
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
    categoryLabel: "Draugų Pasiūlytas"
  };

  appState.contestants.push(newCandidate);
  appState.votes[newId] = 1; // Initial boost

  closeAddModal();
  renderAll();
  showToast(`🥳 ${name} sėkmingai įtrauktas į Tautos Bukiausius!`, "toast-success");
  playSound('vote');

  await pushCloudState();
}

// Confetti Effect
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF2A85', '#00F5D4', '#9D4EDD']
    });
  }
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
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHTML(str) {
  return String(str || "").replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function openAddModal() {
  document.getElementById("addContestantModal")?.classList.remove("hidden");
}

function closeAddModal() {
  document.getElementById("addContestantModal")?.classList.add("hidden");
  document.getElementById("addContestantForm")?.reset();
}

// ==========================================================================
// Initialization & Event Listeners
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Local / Cloud Sync
  loadLocalFallback();
  fetchCloudState();

  // Background auto-polling every 6 seconds for friends' votes
  setInterval(() => {
    if (!appState.isSyncing) {
      fetchCloudState();
    }
  }, 6000);

  // 2. Voter Name & Submit Listener
  const nameInput = document.getElementById("voterNameInput");
  nameInput?.addEventListener("input", () => {
    updateSelectionControls();
  });

  document.getElementById("submitVoteBtn")?.addEventListener("click", handleVoteSubmit);

  // Random Nickname Button
  document.getElementById("randomNickBtn")?.addEventListener("click", () => {
    playSound('select');
    const randomNick = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    if (nameInput) {
      nameInput.value = randomNick;
      updateSelectionControls();
    }
  });

  // Sound Toggle
  document.getElementById("soundToggleBtn")?.addEventListener("click", () => {
    appState.soundEnabled = !appState.soundEnabled;
    const icon = document.getElementById("soundIcon");
    if (icon) icon.textContent = appState.soundEnabled ? "🔊" : "🔇";
    showToast(appState.soundEnabled ? "Garso efektai įjungti" : "Garso efektai išjungti");
  });

  // Manual Cloud Sync
  document.getElementById("manualSyncBtn")?.addEventListener("click", () => {
    playSound('select');
    fetchCloudState();
    showToast("🔄 Duomenys atnaujinti tiesiai iš debesies!");
  });

  // Category Filters
  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeFilter = btn.getAttribute("data-category");
      playSound('select');
      renderContestants();
    });
  });

  // Search Filter
  document.getElementById("searchContestantsInput")?.addEventListener("input", (e) => {
    appState.searchQuery = e.target.value;
    renderContestants();
  });

  // View Mode Toggles
  document.getElementById("viewColumnsBtn")?.addEventListener("click", () => {
    appState.viewMode = "columns";
    document.getElementById("viewColumnsBtn")?.classList.add("active");
    document.getElementById("viewListBtn")?.classList.remove("active");
    document.getElementById("columnsChartContainer")?.classList.remove("hidden");
    document.getElementById("leaderboardContainer")?.classList.add("hidden");
    playSound('select');
  });

  document.getElementById("viewListBtn")?.addEventListener("click", () => {
    appState.viewMode = "list";
    document.getElementById("viewListBtn")?.classList.add("active");
    document.getElementById("viewColumnsBtn")?.classList.remove("active");
    document.getElementById("columnsChartContainer")?.classList.add("hidden");
    document.getElementById("leaderboardContainer")?.classList.remove("hidden");
    playSound('select');
  });

  // Modal Open / Close
  document.getElementById("openAddModalBtn")?.addEventListener("click", openAddModal);
  document.getElementById("closeModalBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("cancelAddBtn")?.addEventListener("click", closeAddModal);
  document.getElementById("addContestantForm")?.addEventListener("submit", handleAddContestant);

  // Modal Emoji Picker
  document.querySelectorAll(".emoji-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".emoji-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const emojiInput = document.getElementById("selectedEmoji");
      if (emojiInput) emojiInput.value = btn.getAttribute("data-emoji");
      playSound('select');
    });
  });

  // Clear data button
  document.getElementById("clearDataBtn")?.addEventListener("click", () => {
    if (confirm("Ar tikrai norite išvalyti visus atiduotus balsus ir atstatyti pradinius duomenis?")) {
      appState.votes = {};
      DEFAULT_CONTESTANTS.forEach(c => appState.votes[c.id] = 0);
      appState.voterLedger = [];
      saveLocalFallback();
      pushCloudState();
      renderAll();
      showToast("Visi balsai atstatyti į nulį.", "toast-success");
    }
  });

  renderAll();
});
