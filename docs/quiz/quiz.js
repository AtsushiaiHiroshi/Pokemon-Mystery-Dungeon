const QUICK_QUESTION_COUNT = 10;
const DATA_BASE = "../data";
const TYPE_PREFERENCES = {
  Fuerte: ["Lucha", "Acero"], Dócil: ["Planta", "Normal"], Osada: ["Fuego", "Lucha"], Alegre: ["Agua", "Eléctrico"],
  Agitada: ["Fuego", "Eléctrico"], Ingenua: ["Normal", "Hada"], Miedosa: ["Hielo", "Siniestro"], Activa: ["Eléctrico", "Volador"],
  Grosera: ["Siniestro", "Lucha"], Serena: ["Psíquico", "Agua"], Plácida: ["Tierra", "Roca"], Huraña: ["Veneno", "Siniestro"],
  Rara: ["Fantasma", "Psíquico"], Mansa: ["Planta", "Hada"], Alocada: ["Agua", "Fuego"], Audaz: ["Dragón", "Acero"]
};

const ui = {
  loading: document.querySelector("#loading"), error: document.querySelector("#error"), errorText: document.querySelector("#errorText"),
  start: document.querySelector("#start"), quiz: document.querySelector("#quiz"), result: document.querySelector("#result"),
  modeButtons: document.querySelectorAll("[data-mode]"), retry: document.querySelector("#retry"), answers: document.querySelector("#answers"),
  questionNumber: document.querySelector("#questionNumber"), questionTitle: document.querySelector("#questionTitle"),
  progressLabel: document.querySelector("#progressLabel"), progressPercent: document.querySelector("#progressPercent"),
  progressBar: document.querySelector("#progressBar"), progressTrack: document.querySelector(".progress-track"),
  backButton: document.querySelector("#backButton"), nextButton: document.querySelector("#nextButton"),
  resultNature: document.querySelector("#resultNature"), resultDescription: document.querySelector("#resultDescription"),
  resultStory: document.querySelector("#resultStory"), revealResult: document.querySelector("#revealResult"),
  personalityChart: document.querySelector("#personalityChart"),
  candidates: document.querySelector("#candidates"), candidateCount: document.querySelector("#candidateCount"),
  copyButton: document.querySelector("#copyButton"), copyStatus: document.querySelector("#copyStatus"), restartButton: document.querySelector("#restartButton"),
  ambienceToggle: document.querySelector("#ambienceToggle")
};
ui.backgroundVideo = document.querySelector("#pmdBackgroundVideo");
const ULTRA_BEASTS = new Set(["nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "stakataka", "blacephalon", "poipole", "naganadel"]);
const PARADOX_POKEMON = new Set(["great-tusk", "scream-tail", "brute-bonnet", "flutter-mane", "slither-wing", "sandy-shocks", "roaring-moon", "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-moth", "iron-thorns", "walking-wake", "raging-bolt", "gouging-fire", "iron-leaves", "iron-crown", "iron-boulder"]);
const state = { quiz: null, pokemon: [], questions: [], answers: [], index: 0, nature: "", scores: {}, mode: "quick", narrative: [], narrativeIndex: 0 };
const selectionSound = new Audio("https://nrosa01.github.io/pmd-quiz-online/audio/select-sound.mp3");
selectionSound.preload = "auto";
let soundEnabled = true;

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const shuffle = list => [...list].sort(() => Math.random() - 0.5);

function setSoundButton() {
  ui.ambienceToggle.textContent = soundEnabled ? "🔊 Música y sonidos" : "🔇 Sonido silenciado";
  ui.ambienceToggle.setAttribute("aria-pressed", String(soundEnabled));
}

function playSelectionSound() {
  if (!soundEnabled) return;
  selectionSound.currentTime = 0;
  selectionSound.play().catch(() => {});
}

function startAmbience() {
  if (!soundEnabled) return;
  document.body.classList.add("has-video");
  ui.backgroundVideo?.play().then(() => { ui.backgroundVideo.muted = false; }).catch(() => {});
}

function show(section) {
  [ui.loading, ui.error, ui.start, ui.quiz, ui.result].forEach(element => { element.hidden = element !== section; });
}

async function loadData() {
  try {
    const [quizResponse, pokemonResponse] = await Promise.all([fetch(`${DATA_BASE}/quiz-es.json`), fetch(`${DATA_BASE}/pokemon-all.json`)]);
    if (!quizResponse.ok || !pokemonResponse.ok) throw new Error("No se encontraron los archivos de datos.");
    state.quiz = await quizResponse.json();
    state.pokemon = await pokemonResponse.json();
    show(ui.start);
    window.scrollTo({ top: 0, behavior: "auto" });
  } catch (error) {
    ui.errorText.textContent = error.message;
    show(ui.error);
  }
}

function startQuiz(mode = "quick") {
  document.body.classList.remove("result-mode", "narrative-mode");
  state.mode = mode;
  const questionCount = mode === "complete" ? state.quiz.questions.length : QUICK_QUESTION_COUNT;
  state.questions = mode === "complete" ? [...state.quiz.questions] : shuffle(state.quiz.questions).slice(0, questionCount);
  state.answers = [];
  state.index = 0;
  state.nature = "";
  state.scores = {};
  show(ui.quiz);
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  const total = state.questions.length;
  const progress = Math.round(((state.index + 1) / total) * 100);
  ui.progressLabel.textContent = `Pregunta ${state.index + 1} de ${total}`;
  ui.progressPercent.textContent = `${progress}%`;
  ui.progressBar.style.width = `${progress}%`;
  ui.progressTrack.setAttribute("aria-valuenow", String(progress));
  ui.questionNumber.textContent = `Pregunta ${String(state.index + 1).padStart(2, "0")}`;
  ui.questionTitle.textContent = question.title;
  ui.answers.innerHTML = question.responses.map((response, index) => `<button class="answer ${state.answers[state.index] === index ? "selected" : ""}" type="button" role="radio" aria-checked="${state.answers[state.index] === index}" data-answer="${index}"><span class="answer-marker" aria-hidden="true"></span><span>${escapeHTML(response.response)}</span></button>`).join("");
  ui.backButton.disabled = state.index === 0;
  ui.nextButton.disabled = state.answers[state.index] == null;
  ui.nextButton.textContent = state.index === total - 1 ? "Ver resultado" : "Siguiente";
}

function chooseAnswer(index) {
  state.answers[state.index] = index;
  playSelectionSound();
  renderQuestion();
}

function nextQuestion() {
  if (state.answers[state.index] == null) return;
  if (state.index < state.questions.length - 1) { state.index += 1; renderQuestion(); return; }
  calculateResult();
}

function previousQuestion() {
  if (state.index > 0) { state.index -= 1; renderQuestion(); }
}

function calculateResult() {
  const scores = Object.fromEntries(state.quiz.natures.map(nature => [nature, 0]));
  state.questions.forEach((question, index) => {
    const response = question.responses[state.answers[index]];
    response?.scores.forEach(score => { scores[score.nature] = (scores[score.nature] ?? 0) + score.points; });
  });
  const highest = Math.max(...Object.values(scores));
  const tied = Object.entries(scores).filter(([, score]) => score === highest).map(([nature]) => nature);
  state.scores = scores;
  state.nature = tied[Math.floor(Math.random() * tied.length)];
  renderResult();
}

function radarPoint(index, radius, total, center = 210) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
}

function renderRadarChart(scores) {
  const natures = state.quiz.natures;
  const total = natures.length;
  const max = Math.max(1, ...Object.values(scores));
  const polygon = radius => natures.map((_, index) => radarPoint(index, radius, total).join(",")).join(" ");
  const dataPolygon = natures.map((nature, index) => radarPoint(index, 150 * ((scores[nature] ?? 0) / max), total).join(",")).join(" ");
  const grid = [37.5, 75, 112.5, 150].map(radius => `<polygon class="radar-grid" points="${polygon(radius)}"></polygon>`).join("");
  const axes = natures.map((nature, index) => {
    const [x, y] = radarPoint(index, 150, total);
    const [labelX, labelY] = radarPoint(index, 178, total);
    const anchor = labelX < 195 ? "end" : labelX > 225 ? "start" : "middle";
    return `<line class="radar-axis" x1="210" y1="210" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line><text class="radar-label" x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}">${escapeHTML(nature)}</text>`;
  }).join("");
  ui.personalityChart.innerHTML = `<svg viewBox="0 0 420 420" focusable="false" aria-hidden="true"><g>${grid}${axes}<polygon class="radar-data" points="${dataPolygon}"></polygon></g></svg>`;
}

function candidateList() {
  const base = state.quiz.naturetopokemon[state.nature] ?? [];
  const preferredTypes = TYPE_PREFERENCES[state.nature] ?? [];
  // evolvesFrom === null identifica la primera etapa, aunque tenga evoluciones.
  // Sólo Pikachu puede saltarse esta regla por ser una excepción PMD.
  // Los Ultraentes quedan fuera salvo Poipole; las formas Paradoja no se ofrecen.
  const eligible = pokemon => pokemon?.quizEligible !== false && !PARADOX_POKEMON.has(pokemon?.identifier) && (!ULTRA_BEASTS.has(pokemon?.identifier) || pokemon?.identifier === "poipole") && (!pokemon?.legendary || pokemon?.identifier === "kubfu") && !pokemon?.mythical && (pokemon?.evolvesFrom == null || pokemon?.name === "Pikachu" || pokemon?.identifier === "kubfu");
  const expanded = state.pokemon.filter(pokemon => eligible(pokemon) && pokemon.types?.some(type => preferredTypes.includes(type)));
  const pmdStarters = new Set(state.quiz.pmdStarters ?? []);
  const offset = state.quiz.natures.indexOf(state.nature) * 37;
  const candidates = [];
  const add = name => { const pokemon = state.pokemon.find(entry => entry.name === name); if (eligible(pokemon) && !candidates.some(entry => entry.id === pokemon.id)) candidates.push(pokemon); };
  base.forEach(add);
  shuffle([...pmdStarters]).forEach(name => { if (candidates.length < 10) add(name); });
  for (let index = 0; index < expanded.length && candidates.length < 10; index += 1) add(expanded[(offset + index * 17) % expanded.length].name);
  return candidates;
}

function renderResult() {
  document.body.classList.add("result-mode", "narrative-mode");
  const candidates = candidateList();
  renderRadarChart(state.scores);
  ui.resultNature.textContent = state.nature;
  ui.resultDescription.textContent = state.quiz.naturedescription[state.nature] ?? "";
  const modeLabel = state.mode === "complete" ? "test completo" : "test rápido";
  ui.candidateCount.textContent = `${candidates.length} opciones · ${modeLabel} · generaciones 1–9`;
  const pmdStarters = new Set(state.quiz.pmdStarters ?? []);
  const visibleCandidates = candidates.slice(0, 2);
  const iconSprite = pokemon => `https://nrosa01.github.io/pmd-quiz-online/img/pokemonicons/${String(pokemon.name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "")}.png`;
  ui.candidates.innerHTML = visibleCandidates.map(pokemon => { const isPmd = pmdStarters.has(pokemon.name); return `<article class="candidate-avatar ${isPmd ? "original" : "expanded"}" title="${escapeHTML(pokemon.name)}" aria-label="${escapeHTML(pokemon.name)}"><img src="${iconSprite(pokemon)}" data-fallback="${escapeHTML(pokemon.sprite)}" alt="${escapeHTML(pokemon.name)}" loading="lazy" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}else{this.hidden=true}"><span class="sr-only">${escapeHTML(pokemon.name)} · ${escapeHTML((pokemon.types ?? []).join(" / "))} · Generación ${pokemon.generation}</span>${isPmd ? "<b>PMD</b>" : ""}</article>`; }).join("");
  ui.candidateCount.textContent = "2 Pokémon · resultado de tu test";
  state.narrative = buildNarrative(state.nature, state.quiz.naturedescription[state.nature] ?? "");
  state.narrativeIndex = 0;
  ui.resultStory.textContent = state.narrative[0];
  ui.revealResult.textContent = "Continuar";
  ui.result.classList.add("pending");
  show(ui.result);
}

function buildNarrative(nature, description) {
  return [
    "Eras una persona…",
    description,
    `Tus decisiones revelan una naturaleza ${nature}. Incluso en los momentos difíciles, esa forma de ser siempre encontró un camino.`,
    "La oscuridad se vuelve ligera. Una voz te pregunta si estás listo para comenzar de nuevo…",
    "Cuando abres los ojos, el viento huele distinto y tus manos ya no son las de antes.",
    "Alguien como tú podría ser…"
  ];
}

async function copyResult() {
  const text = `Mi resultado de Pokémon Mystery Dungeon: ${state.nature}. Recomendaciones: ${candidateList().map(pokemon => pokemon.name).join(", ")}.`;
  try { await navigator.clipboard.writeText(text); ui.copyStatus.textContent = "Resultado copiado al portapapeles."; }
  catch { ui.copyStatus.textContent = text; }
}

ui.modeButtons.forEach(button => button.addEventListener("click", () => { startAmbience(); startQuiz(button.dataset.mode); }));
ui.retry.addEventListener("click", loadData);
ui.backButton.addEventListener("click", previousQuestion);
ui.nextButton.addEventListener("click", nextQuestion);
ui.answers.addEventListener("click", event => { const button = event.target.closest("[data-answer]"); if (button) chooseAnswer(Number(button.dataset.answer)); });
function restartQuiz(event) {
  event?.preventDefault();
  document.body.classList.remove("result-mode", "narrative-mode");
  state.questions = [];
  state.answers = [];
  state.index = 0;
  state.nature = "";
  state.scores = {};
  ui.copyStatus.textContent = "";
  show(ui.start);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
ui.restartButton.addEventListener("click", restartQuiz);
ui.copyButton.addEventListener("click", copyResult);
ui.revealResult.addEventListener("click", () => {
  playSelectionSound();
  if (state.narrativeIndex < state.narrative.length - 1) {
    state.narrativeIndex += 1;
    ui.resultStory.textContent = state.narrative[state.narrativeIndex];
    ui.revealResult.textContent = state.narrativeIndex === state.narrative.length - 1 ? "Descubrir mi Pokémon" : "Continuar";
    return;
  }
  ui.result.classList.remove("pending");
  document.body.classList.remove("narrative-mode");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
ui.ambienceToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) startAmbience(); else { ui.backgroundVideo?.pause(); if (ui.backgroundVideo) ui.backgroundVideo.muted = true; selectionSound.pause(); }
  setSoundButton();
});
document.addEventListener("pointerdown", startAmbience, { once: true });
ui.backgroundVideo?.addEventListener("error", () => document.body.classList.remove("has-video"));
ui.backgroundVideo?.play().then(() => document.body.classList.add("has-video")).catch(() => {});
setSoundButton();
loadData();
