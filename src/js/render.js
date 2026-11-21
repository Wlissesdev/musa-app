/**
 * MUSA - Render Module
 * Render functions for each tab: hoje, diario, ateli, calma, eu, cover
 */

import { 
  MOODS, MOOD_LABELS, TAGS, PROMPTS, AP, QS, RIT, BOOKS, BR, BD, TABS, QT, IMG, $
} from './constants.js';
import { S, saveState } from './state.js';
import { esc, streak, nb, ach, dk, today, dayN, toast } from './utils.js';

// Current tab and draft state
export let tab = "hoje";
export let draft = { mood: null, energy: 3, sleep: 3, tags: [], note: "" };

// Breathing state
let bt = null;
export let bi = 0;

// PIN state
export let pm = null;
export let fst = "";
export let buf = "";
export let pt = [""];
export let fails = 0;
export let until = 0;
export let hid = 0;

// Art state
export let ac = "#d9604a";
export let az = 10;
export let ae = false;
let cx = null;

// Tab navigation
export function go(t) {
  tab = t;
  stopB();
  render();
}

// Main render function
export function render(a = 1) {
  if (pm === "unlock") return;
  const v = $("#v");
  if (!v) return;
  const st = v.scrollTop;

  if (!S.name) {
    $("#nav").innerHTML = "";
    $("#sidenav").innerHTML = "";
    v.innerHTML = cover();
    return;
  }

  const navHtml = TABS.map(t => `<button class="${t[0] === tab ? "on" : ""}" onclick="go('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`).join("");
  $("#nav").innerHTML = navHtml;
  $("#sidenav").innerHTML = navHtml;

  v.innerHTML = ({ hoje, diario, ateli, calma, eu })[tab]();

  if (a) {
    v.className = "";
    void v.offsetWidth;
    v.className = "in";
    v.scrollTop = 0;
  } else {
    v.scrollTop = st;
  }

  if (tab === "ateli") artInit();
}

// Cover screen (first time)
function cover() {
  return `<div class="cover"><div class="in2"><img src="${IMG}" alt="Nise da Silveira"><h1 style="font-size:40px;margin-top:18px">MUSA</h1><p class="q" style="font-size:20px">Um diário para escutar você.</p><p class="mute">Inspirado em Nise da Silveira, que acreditava em cuidar com arte, afeto e escuta.</p><input id="nm" placeholder="Como posso te chamar?" maxlength="30" autocomplete="off"><button class="btn" onclick="start()">Começar</button><p class="mute" style="font-size:12px;margin-top:18px">Seus registros ficam só neste aparelho. O MUSA não substitui acompanhamento psicológico ou médico.</p></div></div>`;
}

export function start() {
  const n = $("#nm").value.trim();
  if (!n) { $("#nm").focus(); return; }
  S.name = n;
  saveState();
  render();
}

// Hoje tab
function hoje() {
  const l = S.log[today];
  const h = new Date().getHours();
  const g = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const q = QS[dayN % QS.length];
  const sk = streak();
  const rd = S.rit[today] || [];

  return `<div class="hero"><div class="hrow"><div><div class="sm">${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</div><h1>${g}, ${esc(S.name)}</h1></div><img class="av" src="${IMG}" alt=""></div><p class="q">"${q[0]}"</p><div class="sm" style="text-transform:none">${q[1]}</div>${sk ? `<span class="fl">💥 ${sk} ${sk > 1 ? "dias seguidos" : "dia"}</span>` : ""}</div>` +
    (l ? `<div class="card"><h3>Registro de hoje ${MOODS[l.mood]}</h3><p class="mute">${MOOD_LABELS[l.mood]}${l.tags.length ? " · " + l.tags.join(", ") : ""}</p><button class="btn alt" onclick="delete S.log[today];saveState();render(0)">Refazer registro</button></div>` :
      `<div class="card"><h3>Como você está agora?</h3><div class="moods">${MOODS.map((m, i) => `<button class="${draft.mood === i ? "on" : ""}" aria-label="${MOOD_LABELS[i]}" onclick="draft.mood=${i};render(0)">${m}</button>`).join("")}</div>
        <label>Energia: ${draft.energy}/5</label><input type="range" min="1" max="5" value="${draft.energy}" oninput="draft.energy=+this.value;this.previousElementSibling.textContent='Energia: ' + this.value + '/5'">
        <label>Qualidade do sono: ${draft.sleep}/5</label><input type="range" min="1" max="5" value="${draft.sleep}" oninput="draft.sleep=+this.value;this.previousElementSibling.textContent='Qualidade do sono: ' + this.value + '/5'">
        <label>O que você sente?</label><div class="row">${TAGS.map(t => `<button class="chip ${draft.tags.includes(t) ? "on" : ""}" onclick="tg('${t}')">${t}</button>`).join("")}</div>
        <label>Nota rápida (opcional)</label><textarea style="min-height:70px" oninput="draft.note=this.value">${esc(draft.note)}</textarea><div class="gap"></div><button class="btn" onclick="saveLog()">Salvar registro</button></div>`) +
    `<div class="card"><div class="rh"><svg class="ring" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" class="rb"/><circle cx="30" cy="30" r="26" class="rf" style="stroke-dashoffset:${163.4 * (1 - rd.length / RIT.length)}"/></svg><div><h3>Rituais de hoje</h3><p class="mute" style="margin:0">${rd.length} de ${RIT.length} cuidados feitos</p></div></div><div class="row">${RIT.map(r => `<button class="chip ${rd.includes(r[0]) ? "on" : ""}" onclick="rt('${r[0]}')">${r[1]} ${r[2]}</button>`).join("")}</div></div>` + insights();
}

function insights() {
  const ds = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return [dk(d), ["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()]];
  });
  const all = Object.values(S.log);
  const vals = ds.map(d => S.log[d[0]]).filter(Boolean);
  const avg = vals.length ? (vals.reduce((a, b) => a + b.mood + 1, 0) / vals.length).toFixed(1) : "–";
  const cnt = {};
  all.forEach(l => l.tags.forEach(t => cnt[t] = (cnt[t] || 0) + 1));
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]).join(", ");
  const m = a => a.length ? a.reduce((s, l) => s + l.mood + 1, 0) / a.length : 0;
  const gs = all.filter(l => l.sleep >= 4);
  const bs = all.filter(l => l.sleep <= 2);
  const ins = gs.length >= 2 && bs.length >= 2 ? `<p style="margin:12px 0 0;font-size:14px">💡 Nos dias de sono bom, seu humor médio foi ${m(gs).toFixed(1)}. Nos de sono ruim, ${m(bs).toFixed(1)}.</p>` : "";
  return `<div class="card"><h3>Sua semana</h3><p class="mute">Humor médio: ${avg}/5${top ? " · Mais frequentes: " + top : ""}</p><div class="bars">${ds.map(d => { const l = S.log[d[0]]; return `<div><i style="height:${l ? (l.mood + 1) * 16 : 3}px;opacity:${l ? 1 : .25}"></i>${d[1]}</div>`; }).join("")}</div>${ins}</div>`;
}

// Diário tab
function diario() {
  const i = dayN % PROMPTS.length;
  return `<h1 style="margin-bottom:12px">Diário</h1><div class="card"><p class="mute">Sugestão de hoje</p><h3 style="margin-bottom:10px">${PROMPTS[i]}</h3><textarea id="jt" placeholder="Escreva sem se preocupar em estar certa."></textarea><div class="gap"></div><button class="btn" onclick="addJ(${i})">Salvar texto</button></div>` +
    (S.journal.length ? S.journal.map(j => `<div class="card"><div class="mute">${esc(j.d)}</div><p class="mute" style="font-family:Georgia,serif;font-style:italic">${esc(j.p)}</p><p style="white-space:pre-wrap;margin:6px 0 10px">${esc(j.t)}</p><button class="chip" onclick="delJ(${j.id})">Apagar</button></div>`).join("") : `<p class="mute">Seus textos aparecem aqui. Escreva o primeiro.</p>`);
}

export function addJ(i) {
  const t = $("#jt").value.trim();
  if (!t) { $("#jt").focus(); return; }
  ach(() => S.journal.unshift({ id: Date.now(), d: new Date().toLocaleDateString("pt-BR"), p: PROMPTS[i], t }));
  toast("Texto salvo");
}

export function delJ(id) {
  if (confirm("Apagar este texto?")) {
    S.journal = S.journal.filter(j => j.id != id);
    saveState();
    render(0);
  }
}

// Ateliê tab
const COLS = ["#d9604a", "#e8a893", "#e0b84a", "#4f8f73", "#3a6ea5", "#6a3a8a", "#2b1425"];

function ateli() {
  return `<h1>Ateliê</h1><p class="mute">Nise da Silveira via na pintura um caminho de expressão. Às vezes a cor diz o que a palavra não alcança.</p><div class="card"><p class="mute">${AP[dayN % AP.length]}</p><canvas id="cv" width="600" height="600"></canvas><div class="row" style="align-items:center;margin-bottom:10px">${COLS.map((c, i) => `<button class="sw ${i === 0 ? "on" : ""}" style="background:${c}" aria-label="Cor ${i + 1}" onclick="setC('${c}',this)"></button>`).join("")}</div><div class="row" style="margin-bottom:12px"><button class="chip" onclick="az=5">Fino</button><button class="chip" onclick="az=10">Médio</button><button class="chip" onclick="az=24">Grosso</button><button class="chip" id="er" onclick="ae=!ae;this.classList.toggle('on',ae)">Borracha</button><button class="chip" onclick="artClear()">Limpar</button></div><button class="btn" onclick="artSave()">Salvar na galeria</button></div>` +
    (S.art.length ? `<h3 style="margin:6px 0 10px">Sua galeria</h3><div class="gal">${S.art.map((a, i) => `<div><img src="${a}" alt="Desenho ${i + 1}"><button class="chip" style="background:var(--card)" onclick="delA(${i})">✦</button></div>`).join("")}</div>` : `<p class="mute">Seus desenhos ficam guardados aqui.</p>`);
}

export function setC(c, b) {
  ac = c;
  ae = false;
  const er = $("#er");
  if (er) er.classList.remove("on");
  document.querySelectorAll(".sw").forEach(s => s.classList.remove("on"));
  b.classList.add("on");
}

export function artClear() {
  if (cx) {
    cx.fillStyle = "#fbf3e6";
    cx.fillRect(0, 0, 600, 600);
  }
}

export function artInit() {
  const c = $("#cv");
  if (!c) return;
  cx = c.getContext("2d");
  cx.lineCap = cx.lineJoin = "round";
  artClear();
  let d = false;
  let l = null;

  const p = e => {
    const r = c.getBoundingClientRect();
    return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 600 / r.height];
  };

  const ln = (a, b) => {
    cx.strokeStyle = ae ? "#fbf3e6" : ac;
    cx.lineWidth = az;
    cx.beginPath();
    cx.moveTo(a[0], a[1]);
    cx.lineTo(b[0], b[1]);
    cx.stroke();
  };

  c.onpointerdown = e => {
    d = true;
    l = p(e);
    c.setPointerCapture(e.pointerId);
    ln(l, [l[0] + .1, l[1]]);
  };

  c.onpointermove = e => {
    if (!d) return;
    const n = p(e);
    ln(l, n);
    l = n;
  };

  c.onpointerup = c.onpointercancel = () => d = false;
}

export function artSave() {
  ach(() => {
    S.art.unshift($("#cv").toDataURL("image/jpeg", .6));
    S.art = S.art.slice(0, 12);
  });
  toast("Desenho guardado 🎨");
}

export function delA(i) {
  if (confirm("Apagar este desenho?")) {
    S.art.splice(i, 1);
    saveState();
    render(0);
  }
}

// Calma tab
function calma() {
  return `<h1>Respirar</h1><div class="row" style="margin:12px 0">${BR.map((b, i) => `<button class="chip ${i === bi ? "on" : ""}" onclick="stopB();bi=${i};render(0)">${b[0]}</button>`).join("")}</div><div class="circle" id="bc">Pronta?</div><button class="btn" id="bb" onclick="breath()">Começar</button><div class="card" style="margin-top:20px"><h3>Se estiver difícil agora</h3><p class="mute">Olhe ao redor e nomeie 3 coisas que vê, 2 que ouve e 1 que toca. Depois beba um pouco de água.</p></div>`;
}

export function stopB() {
  clearTimeout(bt);
  bt = null;
}

export function breath() {
  const c = $("#bc");
  const b = $("#bb");
  if (bt) {
    stopB();
    c.style.transform = "";
    c.textContent = "Pronta?";
    b.textContent = "Começar";
    return;
  }
  b.textContent = "Parar";
  const P = BR[bi][1];
  const run = i => {
    const [n, s, k] = P[i % P.length];
    c.style.transition = `transform ${s}s ease-in-out`;
    c.style.transform = `scale(${k})`;
    c.textContent = n;
    bt = setTimeout(() => run(i + 1), s * 1000);
  };
  run(0);
}

// Eu tab
function eu() {
  const p = S.plan;
  return `<div class="card"><h3>Precisa de ajuda agora?</h3><p class="mute">No Brasil, os atendimentos abaixo são gratuitos.</p><a class="tel" href="tel:188">CVV · 188 · apoio emocional 24h</a><a class="tel" href="tel:192">SAMU · 192 · emergência médica</a><a class="tel" href="tel:180">Ligue 180 · violência contra a mulher</a></div>
  <div class="card"><h3>Conquistas · ${nb()}/${BD.length}</h3><div class="bd" style="margin-top:10px">${BD.map(b => `<div class="${b[3]() ? "" : "lk"}"><b>${b[0]}</b>${b[1]}</div>`).join("")}</div></div>
  <div class="card"><h3>Meu plano de apoio</h3><p class="mute">Escreva agora, com calma, para consultar nos dias difíceis.</p>
  <label>Sinais de que não estou bem</label><textarea onchange="S.plan.signs=this.value;saveState()">${esc(p.signs)}</textarea>
  <label>O que me ajuda a me acalmar</label><textarea onchange="S.plan.coping=this.value;saveState()">${esc(p.coping)}</textarea>
  <label>Pessoa de confiança</label><input value="${esc(p.people)}" placeholder="Nome" onchange="S.plan.people=this.value;saveState();render(0)"><label>Telefone dela</label><input type="tel" value="${esc(p.phone)}" onchange="S.plan.phone=this.value.replace(/[^0-9+]/g,'');saveState();render(0)">
  ${p.phone ? `<div class="gap"></div><a class="tel" href="tel:${esc(p.phone)}">Ligar para ${esc(p.people || "minha pessoa de confiança")}</a>` : ""}</div>
  <div class="card"><h3>Leituras que abrem conversa</h3><p class="mute">Inspiradas nas obras da pesquisa MUSA. Leve a pergunta para o diário.</p>${BOOKS.map(b => `<div class="bk"><b>${b[0]}</b><div class="mute" style="font-size:12px;margin:0">${b[1]}</div><p style="margin:4px 0 0;font-size:14px">${b[2]}</p></div>`).join("")}</div>
  <div class="card"><h3>Segurança e privacidade</h3><p class="mute">Seus dados ficam só neste aparelho e nunca são enviados. ${S.pin ? "O PIN protege a abertura do app." : "Crie um PIN para proteger a abertura do app."}</p>${SEC ? (S.pin ? `<button class="btn alt" onclick="pm='off';buf='';sp('Remover PIN','Digite o PIN atual.')">Remover PIN</button>` : `<button class="btn" onclick="pm='new';buf='';sp('Criar PIN','Escolha 4 números.')">Criar PIN de 4 dígitos</button>`) : `<p class="mute">PIN indisponível neste navegador.</p>`}</div>
  <div class="card"><h3>Sobre o MUSA</h3><p style="font-size:14px;margin:0">O MUSA nasceu de uma pesquisa de literatura comparada sobre saúde mental feminina da ArteCeb. Nise da Silveira lembra que cuidar também é escutar, criar e acolher. Este app não substitui profissionais de saúde.</p></div>
  <div class="card"><h3>Seus dados</h3><div class="gap"></div><button class="btn alt" onclick="cp()">Copiar meus dados</button><div class="gap"></div><button class="btn alt" onclick="wipe()">Apagar tudo</button></div>`;
}

export function cp() {
  try {
    navigator.clipboard.writeText(JSON.stringify({ ...S, art: [], pin: null }, null, 1)).then(
      () => toast("Dados copiados"),
      () => toast("Não foi possível copiar")
    );
  } catch (e) {
    toast("Não foi possível copiar");
  }
}

export function wipe() {
  if (confirm("Apagar todos os seus registros? Isso não pode ser desfeito.")) {
    try { localStorage.removeItem("musa.v2"); } catch (e) { }
    S.name = "";
    S.log = {};
    S.journal = [];
    S.rit = {};
    S.art = [];
    S.plan = {};
    S.pin = null;
    tab = "hoje";
    render();
  }
}
