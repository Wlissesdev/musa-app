/**
 * MUSA — telas e renderização
 * Cada aba é uma função que devolve HTML. Os eventos usam funções globais
 * (registradas em main.js), nunca atribuições a variáveis soltas.
 */

import {
  MOODS, MOOD_LABELS, TAGS, PROMPTS, AP, QS, RIT, BOOKS, BR, TABS, IMG, SEC
} from './data.js';
import { S, ui, save, freshDraft } from './store.js';
import { $, esc, streak, nb, dk, today, dayN, BD, ach, toast } from './dom.js';

// ---------------------------------------------------------------------------
// Navegação e render principal
// ---------------------------------------------------------------------------

const VIEWS = { hoje, diario, ateli, calma, eu };

export function go(t) {
  ui.tab = t;
  stopBreath();
  render();
}

export function render(animate = 1) {
  if (ui.pm === "unlock") return;
  const v = $("#v");
  if (!v) return;
  const st = v.scrollTop;

  if (!S.name) {
    $("#nav").innerHTML = "";
    $("#sidenav").innerHTML = "";
    v.innerHTML = cover();
    return;
  }

  const nav = TABS.map((t) =>
    `<button class="${t[0] === ui.tab ? "on" : ""}" onclick="go('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`
  ).join("");
  $("#nav").innerHTML = nav;
  $("#sidenav").innerHTML = nav;

  v.innerHTML = VIEWS[ui.tab]();

  if (animate) {
    v.classList.remove("in");
    void v.offsetWidth;
    v.classList.add("in");
    v.scrollTop = 0;
  } else {
    v.scrollTop = st;
  }

  if (ui.tab === "ateli") artInit();
}

// ---------------------------------------------------------------------------
// Capa (primeira vez)
// ---------------------------------------------------------------------------

function cover() {
  return `<div class="cover"><div class="in2">` +
    `<img src="${IMG}" alt="Nise da Silveira">` +
    `<h1 style="font-size:40px;margin-top:18px">MUSA</h1>` +
    `<p class="q" style="font-size:20px">Um diário para escutar você.</p>` +
    `<p class="mute">Inspirado em Nise da Silveira, que acreditava em cuidar com arte, afeto e escuta.</p>` +
    `<input id="nm" placeholder="Como posso te chamar?" maxlength="30" autocomplete="off">` +
    `<button class="btn" onclick="startApp()">Começar</button>` +
    `<p class="mute" style="font-size:12px;margin-top:18px">Seus registros ficam só neste aparelho. O MUSA não substitui acompanhamento psicológico ou médico.</p>` +
    `</div></div>`;
}

export function startApp() {
  const el = $("#nm");
  const n = (el && el.value ? el.value : "").trim();
  if (!n) { el && el.focus(); return; }
  S.name = n;
  save();
  render();
}

// ---------------------------------------------------------------------------
// Aba Hoje
// ---------------------------------------------------------------------------

function hoje() {
  const l = S.log[today];
  const h = new Date().getHours();
  const g = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const q = QS[dayN % QS.length];
  const sk = streak();
  const rd = S.rit[today] || [];
  const dataLonga = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const hero =
    `<div class="hero"><div class="hrow"><div><div class="sm">${dataLonga}</div><h1>${g}, ${esc(S.name)}</h1></div>` +
    `<img class="av" src="${IMG}" alt=""></div><p class="q">“${esc(q[0])}”</p>` +
    `<div class="sm" style="text-transform:none">${esc(q[1])}</div>` +
    `${sk ? `<span class="fl">🔥 ${sk} ${sk > 1 ? "dias seguidos" : "dia"}</span>` : ""}</div>`;

  const registro = l
    ? `<div class="card"><h3>Registro de hoje ${MOODS[l.mood]}</h3>` +
      `<p class="mute">${MOOD_LABELS[l.mood]}${l.tags && l.tags.length ? " · " + esc(l.tags.join(", ")) : ""}</p>` +
      `<button class="btn alt" onclick="undoToday()">Refazer registro</button></div>`
    : `<div class="card"><h3>Como você está agora?</h3>` +
      `<div class="moods">${MOODS.map((m, i) => `<button class="${ui.draft.mood === i ? "on" : ""}" aria-label="${MOOD_LABELS[i]}" onclick="selectMood(${i})">${m}</button>`).join("")}</div>` +
      `<label id="enLabel">Energia: ${ui.draft.energy}/5</label><input type="range" min="1" max="5" value="${ui.draft.energy}" oninput="setEnergy(this.value)">` +
      `<label id="slLabel">Qualidade do sono: ${ui.draft.sleep}/5</label><input type="range" min="1" max="5" value="${ui.draft.sleep}" oninput="setSleep(this.value)">` +
      `<label>O que você sente?</label><div class="row">${TAGS.map((t, i) => `<button class="chip ${ui.draft.tags.includes(t) ? "on" : ""}" onclick="toggleTag(${i})">${t}</button>`).join("")}</div>` +
      `<label>Nota rápida (opcional)</label><textarea style="min-height:70px" oninput="setNote(this.value)">${esc(ui.draft.note)}</textarea>` +
      `<div class="gap"></div><button class="btn" onclick="saveLog()">Salvar registro</button></div>`;

  const rituais =
    `<div class="card"><div class="rh"><svg class="ring" viewBox="0 0 60 60" aria-hidden="true">` +
    `<circle cx="30" cy="30" r="26" class="rb"/><circle cx="30" cy="30" r="26" class="rf" style="stroke-dashoffset:${163.4 * (1 - rd.length / RIT.length)}"/>` +
    `</svg><div><h3>Rituais de hoje</h3><p class="mute" style="margin:0">${rd.length} de ${RIT.length} cuidados feitos</p></div></div>` +
    `<div class="row">${RIT.map((r, i) => `<button class="chip ${rd.includes(r[0]) ? "on" : ""}" onclick="toggleRitual(${i})">${r[1]} ${r[2]}</button>`).join("")}</div></div>`;

  return hero + registro + rituais + insights();
}

function insights() {
  const ds = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return [dk(d), ["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()]];
  });
  const all = Object.values(S.log);
  const vals = ds.map((d) => S.log[d[0]]).filter(Boolean);
  const avg = vals.length ? (vals.reduce((a, b) => a + b.mood + 1, 0) / vals.length).toFixed(1) : "–";
  const cnt = {};
  all.forEach((l) => (l.tags || []).forEach((t) => (cnt[t] = (cnt[t] || 0) + 1)));
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]).join(", ");
  const mean = (a) => (a.length ? a.reduce((s, l) => s + l.mood + 1, 0) / a.length : 0);
  const bom = all.filter((l) => l.sleep >= 4);
  const ruim = all.filter((l) => l.sleep <= 2);
  const dica = bom.length >= 2 && ruim.length >= 2
    ? `<p style="margin:12px 0 0;font-size:14px">💡 Nos dias de sono bom, seu humor médio foi ${mean(bom).toFixed(1)}. Nos de sono ruim, ${mean(ruim).toFixed(1)}.</p>`
    : "";
  return `<div class="card"><h3>Sua semana</h3><p class="mute">Humor médio: ${avg}/5${top ? " · Mais frequentes: " + esc(top) : ""}</p>` +
    `<div class="bars">${ds.map((d) => { const l = S.log[d[0]]; return `<div><i style="height:${l ? (l.mood + 1) * 16 : 3}px;opacity:${l ? 1 : .25}"></i>${d[1]}</div>`; }).join("")}</div>${dica}</div>`;
}

// ---------------------------------------------------------------------------
// Aba Diário
// ---------------------------------------------------------------------------

function diario() {
  const i = dayN % PROMPTS.length;
  const lista = S.journal.length
    ? S.journal.map((j) =>
        `<div class="card"><div class="mute">${esc(j.d)}</div>` +
        `<p class="mute" style="font-family:Georgia,serif;font-style:italic">${esc(j.p)}</p>` +
        `<p style="white-space:pre-wrap;margin:6px 0 10px">${esc(j.t)}</p>` +
        `<button class="chip" onclick="delJournal(${j.id})">Apagar</button></div>`
      ).join("")
    : `<p class="mute">Seus textos aparecem aqui. Escreva o primeiro.</p>`;

  return `<h1 style="margin-bottom:12px">Diário</h1>` +
    `<div class="card"><p class="mute">Sugestão de hoje</p><h3 style="margin-bottom:10px">${esc(PROMPTS[i])}</h3>` +
    `<textarea id="jt" placeholder="Escreva sem se preocupar em estar certa."></textarea>` +
    `<div class="gap"></div><button class="btn" onclick="addJournal(${i})">Salvar texto</button></div>` + lista;
}

// ---------------------------------------------------------------------------
// Aba Ateliê
// ---------------------------------------------------------------------------

const COLS = ["#d9604a", "#e8a893", "#e0b84a", "#4f8f73", "#3a6ea5", "#6a3a8a", "#2b1425"];

function ateli() {
  const galeria = S.art.length
    ? `<h3 style="margin:6px 0 10px">Sua galeria</h3><div class="gal">${S.art.map((a, i) =>
        `<div><img src="${a}" alt="Desenho ${i + 1}"><button class="chip" style="background:var(--card)" aria-label="Apagar desenho" onclick="delArt(${i})">✕</button></div>`
      ).join("")}</div>`
    : `<p class="mute">Seus desenhos ficam guardados aqui.</p>`;

  return `<h1>Ateliê</h1>` +
    `<p class="mute">Nise da Silveira via na pintura um caminho de expressão. Às vezes a cor diz o que a palavra não alcança.</p>` +
    `<div class="card"><p class="mute">${esc(AP[dayN % AP.length])}</p>` +
    `<canvas id="cv" width="600" height="600"></canvas>` +
    `<div class="row" style="align-items:center;margin-bottom:10px">${COLS.map((c, i) =>
      `<button class="sw ${i === 0 ? "on" : ""}" style="background:${c}" aria-label="Cor ${i + 1}" onclick="setColor(${i})"></button>`
    ).join("")}</div>` +
    `<div class="row" style="margin-bottom:12px">` +
    `<button class="chip" onclick="setBrush(5)">Fino</button>` +
    `<button class="chip" onclick="setBrush(10)">Médio</button>` +
    `<button class="chip" onclick="setBrush(24)">Grosso</button>` +
    `<button class="chip" id="er" onclick="toggleEraser()">Borracha</button>` +
    `<button class="chip" onclick="clearArt()">Limpar</button></div>` +
    `<button class="btn" onclick="saveArt()">Salvar na galeria</button></div>` + galeria;
}

export function setColor(i) {
  ui.color = COLS[i] || ui.color;
  ui.eraser = false;
  const er = $("#er");
  if (er) er.classList.remove("on");
  document.querySelectorAll(".sw").forEach((s, k) => s.classList.toggle("on", k === i));
}

export function setBrush(n) { ui.size = n; }

export function toggleEraser() {
  ui.eraser = !ui.eraser;
  const er = $("#er");
  if (er) er.classList.toggle("on", ui.eraser);
}

export function clearArt() {
  const cx = ui.cx;
  if (!cx) return;
  cx.fillStyle = "#fbf3e6";
  cx.fillRect(0, 0, 600, 600);
}

export function artInit() {
  const c = $("#cv");
  if (!c) return;
  const cx = c.getContext("2d");
  ui.cx = cx;
  cx.lineCap = cx.lineJoin = "round";
  clearArt();

  let drawing = false;
  let last = null;

  const punto = (e) => {
    const r = c.getBoundingClientRect();
    return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 600 / r.height];
  };
  const linha = (a, b) => {
    cx.strokeStyle = ui.eraser ? "#fbf3e6" : ui.color;
    cx.lineWidth = ui.size;
    cx.beginPath();
    cx.moveTo(a[0], a[1]);
    cx.lineTo(b[0], b[1]);
    cx.stroke();
  };

  c.onpointerdown = (e) => {
    drawing = true;
    last = punto(e);
    try { c.setPointerCapture(e.pointerId); } catch (_) {}
    linha(last, [last[0] + 0.1, last[1]]);
  };
  c.onpointermove = (e) => {
    if (!drawing) return;
    const n = punto(e);
    linha(last, n);
    last = n;
  };
  c.onpointerup = c.onpointercancel = c.onpointerleave = () => { drawing = false; };
}

export function saveArt() {
  const c = $("#cv");
  if (!c) return;
  ach(() => {
    S.art.unshift(c.toDataURL("image/jpeg", 0.6));
    S.art = S.art.slice(0, 12);
  });
  toast("Desenho guardado 🎨");
  render(0);
}

export function delArt(i) {
  if (confirm("Apagar este desenho?")) {
    S.art.splice(i, 1);
    save();
    render(0);
  }
}

// ---------------------------------------------------------------------------
// Aba Calma
// ---------------------------------------------------------------------------

function calma() {
  return `<h1>Respirar</h1>` +
    `<div class="row" style="margin:12px 0">${BR.map((b, i) =>
      `<button class="chip ${i === ui.breathIdx ? "on" : ""}" onclick="selectBreath(${i})">${b[0]}</button>`
    ).join("")}</div>` +
    `<div class="circle" id="bc">Pronta?</div>` +
    `<button class="btn" id="bb" onclick="toggleBreath()">Começar</button>` +
    `<div class="card" style="margin-top:20px"><h3>Se estiver difícil agora</h3>` +
    `<p class="mute">Olhe ao redor e nomeie 3 coisas que vê, 2 que ouve e 1 que toca. Depois beba um pouco de água.</p></div>`;
}

export function stopBreath() {
  if (ui.breath) {
    clearTimeout(ui.breath);
    ui.breath = null;
  }
}

export function selectBreath(i) {
  stopBreath();
  ui.breathIdx = i;
  render(0);
}

export function toggleBreath() {
  const c = $("#bc");
  const b = $("#bb");
  if (!c || !b) return;

  if (ui.breath) {
    stopBreath();
    c.style.transform = "";
    c.textContent = "Pronta?";
    b.textContent = "Começar";
    return;
  }

  b.textContent = "Parar";
  const passos = BR[ui.breathIdx][1];
  const run = (i) => {
    const [nome, segs, escala] = passos[i % passos.length];
    c.style.transition = `transform ${segs}s ease-in-out`;
    c.style.transform = `scale(${escala})`;
    c.textContent = nome;
    ui.breath = setTimeout(() => run(i + 1), segs * 1000);
  };
  run(0);
}

// ---------------------------------------------------------------------------
// Aba Eu
// ---------------------------------------------------------------------------

function eu() {
  const p = S.plan || {};
  const pinArea = SEC
    ? (S.pin
        ? `<button class="btn alt" onclick="openPinRemove()">Remover PIN</button>`
        : `<button class="btn" onclick="openPinCreate()">Criar PIN de 4 dígitos</button>`)
    : `<p class="mute">PIN indisponível neste navegador.</p>`;

  return `<div class="card"><h3>Precisa de ajuda agora?</h3><p class="mute">No Brasil, os atendimentos abaixo são gratuitos.</p>` +
    `<a class="tel" href="tel:188">CVV · 188 · apoio emocional 24h</a>` +
    `<a class="tel" href="tel:192">SAMU · 192 · emergência médica</a>` +
    `<a class="tel" href="tel:180">Ligue 180 · violência contra a mulher</a></div>` +
    `<div class="card"><h3>Conquistas · ${nb()}/${BD.length}</h3><div class="bd" style="margin-top:10px">` +
    `${BD.map((b) => `<div class="${b[3]() ? "" : "lk"}"><b>${b[0]}</b>${b[1]}</div>`).join("")}</div></div>` +
    `<div class="card"><h3>Meu plano de apoio</h3><p class="mute">Escreva agora, com calma, para consultar nos dias difíceis.</p>` +
    `<label>Sinais de que não estou bem</label><textarea onchange="setPlan('signs', this.value)">${esc(p.signs)}</textarea>` +
    `<label>O que me ajuda a me acalmar</label><textarea onchange="setPlan('coping', this.value)">${esc(p.coping)}</textarea>` +
    `<label>Pessoa de confiança</label><input value="${esc(p.people)}" placeholder="Nome" onchange="setPlan('people', this.value)">` +
    `<label>Telefone dela</label><input type="tel" value="${esc(p.phone)}" inputmode="tel" onchange="setPlan('phone', this.value)">` +
    `${p.phone ? `<div class="gap"></div><a class="tel" href="tel:${esc(p.phone)}">Ligar para ${esc(p.people || "minha pessoa de confiança")}</a>` : ""}</div>` +
    `<div class="card"><h3>Leituras que abrem conversa</h3><p class="mute">Inspiradas nas obras da pesquisa MUSA. Leve a pergunta para o diário.</p>` +
    `${BOOKS.map((b) => `<div class="bk"><b>${b[0]}</b><div class="mute" style="font-size:12px;margin:0">${b[1]}</div><p style="margin:4px 0 0;font-size:14px">${b[2]}</p></div>`).join("")}</div>` +
    `<div class="card"><h3>Segurança e privacidade</h3><p class="mute">Seus dados ficam só neste aparelho e nunca são enviados. ${S.pin ? "O PIN protege a abertura do app." : "Crie um PIN para proteger a abertura do app."}</p>${pinArea}</div>` +
    `<div class="card"><h3>Sobre o MUSA</h3><p style="font-size:14px;margin:0">O MUSA nasceu de uma pesquisa de literatura comparada sobre saúde mental feminina da ArteCeb. Nise da Silveira lembra que cuidar também é escutar, criar e acolher. Este app não substitui profissionais de saúde.</p></div>` +
    `<div class="card"><h3>Seus dados</h3><div class="gap"></div><button class="btn alt" onclick="copyData()">Copiar meus dados</button><div class="gap"></div><button class="btn alt" onclick="wipeAll()">Apagar tudo</button></div>`;
}
