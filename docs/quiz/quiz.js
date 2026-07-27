const QUICK_QUESTION_COUNT = 8;
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
  candidates: document.querySelector("#candidates"), candidateCount: document.querySelector("#candidateCount"),
  copyButton: document.querySelector("#copyButton"), copyStatus: document.querySelector("#copyStatus"), restartButton: document.querySelector("#restartButton")
};
const state = { quiz: null, pokemon: [], questions: [], answers: [], index: 0, nature: "", mode: "quick" };

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const shuffle = list => [...list].sort(() => Math.random() - 0.5);

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
  } catch (error) {
    ui.errorText.textContent = error.message;
    show(ui.error);
  }
}

function startQuiz(mode = "quick") {
  state.mode = mode;
  const questionCount = mode === "complete" ? state.quiz.questions.length : QUICK_QUESTION_COUNT;
  state.questions = mode === "complete" ? [...state.quiz.questions] : shuffle(state.quiz.questions).slice(0, questionCount);
  state.answers = [];
  state.index = 0;
  state.nature = "";
  show(ui.quiz);
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
  state.nature = tied[Math.floor(Math.random() * tied.length)];
  renderResult();
}

function candidateList() {
  const base = state.quiz.naturetopokemon[state.nature] ?? [];
  const preferredTypes = TYPE_PREFERENCES[state.nature] ?? [];
  const eligible = pokemon => pokemon?.quizEligible !== false && (pokemon?.evolvesFrom == null || pokemon?.name === "Pikachu");
  const expanded = state.pokemon.filter(pokemon => eligible(pokemon) && pokemon.types?.some(type => preferredTypes.includes(type)));
  const offset = state.quiz.natures.indexOf(state.nature) * 37;
  const candidates = [];
  const add = name => { const pokemon = state.pokemon.find(entry => entry.name === name); if (eligible(pokemon) && !candidates.some(entry => entry.id === pokemon.id)) candidates.push(pokemon); };
  base.forEach(add);
  for (let index = 0; index < expanded.length && candidates.length < 10; index += 1) add(expanded[(offset + index * 17) % expanded.length].name);
  return candidates;
}

function renderResult() {
  const candidates = candidateList();
  ui.resultNature.textContent = state.nature;
  ui.resultDescription.textContent = state.quiz.naturedescription[state.nature] ?? "";
  const modeLabel = state.mode === "complete" ? "test completo" : "test rápido";
  ui.candidateCount.textContent = `${candidates.length} opciones · ${modeLabel} · generaciones 1–9`;
  ui.candidates.innerHTML = candidates.map((pokemon, index) => `<article class="candidate ${index < 2 ? "original" : "expanded"}"><img src="${escapeHTML(pokemon.sprite)}" alt="${escapeHTML(pokemon.name)}" loading="lazy" onerror="this.hidden=true"><div><h4>${escapeHTML(pokemon.name)}</h4><p>${escapeHTML(pokemon.types.join(" / "))}</p><span>Generación ${pokemon.generation}</span></div>${index < 2 ? "<b>PMD</b>" : ""}</article>`).join("");
  show(ui.result);
}

async function copyResult() {
  const text = `Mi resultado de Pokémon Mystery Dungeon: ${state.nature}. Recomendaciones: ${candidateList().map(pokemon => pokemon.name).join(", ")}.`;
  try { await navigator.clipboard.writeText(text); ui.copyStatus.textContent = "Resultado copiado al portapapeles."; }
  catch { ui.copyStatus.textContent = text; }
}

ui.modeButtons.forEach(button => button.addEventListener("click", () => startQuiz(button.dataset.mode)));
ui.retry.addEventListener("click", loadData);
ui.backButton.addEventListener("click", previousQuestion);
ui.nextButton.addEventListener("click", nextQuestion);
ui.answers.addEventListener("click", event => { const button = event.target.closest("[data-answer]"); if (button) chooseAnswer(Number(button.dataset.answer)); });
ui.restartButton.addEventListener("click", () => show(ui.start));
ui.copyButton.addEventListener("click", copyResult);
loadData();
