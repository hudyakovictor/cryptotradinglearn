/* НАЛОГ НА НАДЕЖДУ — движок (vanilla JS, без зависимостей) */

(function(){
"use strict";

const SAVE_KEY = "nalog-na-nadezhdu-v1";
const screen = document.getElementById("screen");

let S = {          // состояние
  level: 0,        // индекс текущего уровня в LEVELS
  scene: 0,        // индекс сцены
  capital: 1000,
  faith: 100,
  status: "клиент приёмной",
  chapterDone: false,
  started: false,
  examAnswers: null,
  flagsState: null
};

/* ---------- сохранение ---------- */
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw){ S = Object.assign(S, JSON.parse(raw)); return true; }
  }catch(e){}
  return false;
}

/* ---------- утилиты ---------- */
const esc = s => String(s);
function el(html){ const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstElementChild; }
function fmtCapital(v){ return (Math.round(v*10)/10).toLocaleString("ru-RU")+" USDT"; }

function applyEffects(effects){
  const badges=[];
  if(effects.capital){
    S.capital=Math.max(0,S.capital+effects.capital);
    badges.push(`<span class="effect neg">−${Math.abs(effects.capital)} USDT · налог на надежду</span>`);
  }
  if(effects.faith){
    S.faith=Math.max(0,Math.min(100,S.faith+effects.faith));
    badges.push(`<span class="effect ${effects.faith<0?'pos':'neu'}">вера в график ${effects.faith}%</span>`);
  }
  save(); updateHUD();
  return badges;
}

/* ---------- HUD ---------- */
function updateStatusByLevel(){
  if(S.chapterDone){ S.status="выживший 0–10"; return; }
  S.status = S.level>=9?"подписавший":(S.level>=5?"бдительный новичок":"клиент приёмной");
}
function updateHUD(){
  updateStatusByLevel();
  document.getElementById("hud-level").textContent = (S.chapterDone ? "10" : LEVELS[Math.min(S.level,10)].no) + "/99";
  document.getElementById("hud-capital").textContent = fmtCapital(S.capital);
  const fEl=document.getElementById("hud-faith");
  fEl.textContent = S.faith+"%";
  fEl.className="hud-value "+(S.faith>70?"bad":(S.faith>40?"":"good"));
  document.getElementById("hud-status").textContent = S.status;
}

/* ---------- бегущая строка ---------- */
function buildTicker(){
  const track=document.getElementById("ticker-track");
  const items=TICKER.map(t=>`<span>${t}</span><span class="t-sep">✕</span>`).join("");
  track.innerHTML=items+items;
}

/* ================= ЭКРАНЫ ================= */

function renderTitle(){
  const hasSave = S.started && (S.level>0 || S.chapterDone);
  screen.innerHTML="";
  screen.appendChild(el(`
    <div class="title-screen">
      <div class="card">
        <div class="kicker">СЛУЖБА ПО ПЕРЕРАСПРЕДЕЛЕНИЮ ЧУЖИХ ДЕНЕГ ПРЕДСТАВЛЯЕТ</div>
        <div class="headline">Сатирическая обучающая игра о&nbsp;криптотрейдинге</div>
        <div class="par">Уровни 0–99. Восемь глав. Первая — «Приёмная» — уже рассекречена.
        Каждая глава заканчивается аттестатом. Каждый аттестат означает одно: вы снова знаете чуть больше, чем обещали.</div>
      </div>
      <div class="title-notice">
        <div class="t">${TITLE_SCREEN.noticeTitle}</div>
        ${TITLE_SCREEN.notice.map(p=>`<div class="par">${p}</div>`).join("")}
      </div>
      <button class="btn primary big-btn" id="btn-enter">${hasSave?TITLE_SCREEN.resume:TITLE_SCREEN.enter}</button>
      <div class="par small footnote-center">${TITLE_SCREEN.enterSub}</div>
      ${hasSave?`<button class="btn small" id="btn-reset" style="margin:14px auto;display:block;width:auto">${TITLE_SCREEN.reset}</button>`:""}
      <div class="title-credits">${TITLE_SCREEN.credits}</div>
    </div>`));
  document.getElementById("btn-enter").onclick=()=>{ S.started=true; save(); renderMap(); };
  const rb=document.getElementById("btn-reset");
  if(rb) rb.onclick=()=>{ localStorage.removeItem(SAVE_KEY);
    S={level:0,scene:0,capital:1000,faith:100,status:"клиент приёмной",chapterDone:false,started:false,examAnswers:null,flagsState:null};
    save(); updateHUD(); renderTitle(); };
}

/* ---------- карта глав ---------- */
function renderMap(){
  screen.innerHTML="";
  const wrap=el(`<div><div class="card"><div class="kicker">КАРТА АРХИВА</div>
    <div class="headline">Восемь глав до просветления</div>
    <div class="par">Каждая глава — макроблок учебной системы 0–99. Внутри — уровни, механики и справки из архива.
    Глава открыта одна. Остальные запечатаны: ${'"'}департамент управляемой паники${'"'} работает над рассекречиванием.</div></div></div>`);
  CHAPTERS.forEach((ch,i)=>{
    let cls=ch.cls||"locked";
    if(S.chapterDone && i===0) cls="done";
    if(!S.chapterDone && i===0) cls="current";
    const c=el(`<div class="chapter ${cls}">
      <div class="ch-no">${ch.no}</div>
      <div><div class="ch-title">Глава ${i+1}. ${ch.title}</div>
      <div class="ch-tease">${ch.tease}</div>
      <span class="ch-tag">${S.chapterDone&&i===0?"ПРОЙДЕНА":ch.tag}</span></div></div>`);
    if(i===0) c.onclick=()=>{ S.level=0; S.scene=0; save(); renderLevel(); };
    wrap.appendChild(c);
  });
  const foot=el(`<div class="card archive"><div class="kicker">СПРАВКА ИЗ АРХИВА</div>
    <div class="fact">Карта глав соответствует восьми макроблокам учебной системы, построенной на исследовании
    140 источников: основы/безопасность → биржа/исполнение → анализ → классы подходов → систематика → валидация →
    профессиональные методы → исследователь. Допуск к реальным деньгам — шесть ступеней A–F, критерий — процесс.</div>
    <div class="src">research/iteration-5 · FINAL_RESEARCH_CORPUS</div></div>`);
  wrap.appendChild(foot);
  screen.appendChild(wrap);
  updateHUD();
}

/* ---------- уровень ---------- */
function renderLevel(){
  const L=LEVELS[S.level];
  screen.innerHTML="";
  const card=el(`<div>
    <div class="card"><div class="kicker">ГЛАВА 1 · УРОВЕНЬ ${L.no} ИЗ 99</div>
    <div class="headline">${L.title}</div></div>
    <div id="scene-slot"></div></div>`);
  screen.appendChild(card);
  renderScene();
  updateHUD();
}

function sceneSlot(){ return document.getElementById("scene-slot"); }

function renderScene(){
  const L=LEVELS[S.level];
  const sc=L.scenes[S.scene];
  const slot=sceneSlot();
  slot.innerHTML="";
  if(!sc){ renderLevelEnd(); return; }

  if(sc.type==="text"){
    slot.appendChild(el(`<div class="card"><div class="par">${sc.paras.join("</div><div class='par'>")}</div>
      <button class="btn small" id="next">${S.scene<L.scenes.length-1||L.archive?"ДАЛЬШЕ":"ЗАВЕРШИТЬ УРОВЕНЬ"}</button></div>`));
    document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
  }

  else if(sc.type==="choice"){
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div><div id="opts"></div><div id="fb"></div></div>`));
    const opts=document.getElementById("opts");
    sc.options.forEach((o,i)=>{
      const b=el(`<button class="btn">${o.label}</button>`);
      b.onclick=()=>{
        const badges=applyEffects(o.effects||{});
        document.getElementById("fb").innerHTML=`<div class="outcome"><div class="verdict">${o.outcome}</div>
          ${badges.length?`<div class="effects">${badges.join("")}</div>`:""}
          <button class="btn small" id="cont">ДАЛЬШЕ</button></div>`;
        Array.from(opts.children).forEach(x=>x.disabled=true);
        document.getElementById("cont").onclick=()=>{ S.scene++; save(); renderScene(); };
      };
      opts.appendChild(b);
    });
  }

  else if(sc.type==="sign"){
    slot.appendChild(el(`<div class="card report"><div class="par"><b>${sc.prompt}</b></div>
      <div class="outcome" style="border-style:solid"><div class="verdict">${sc.doc}</div></div>
      <div id="opts"></div><div id="fb"></div></div>`));
    const opts=document.getElementById("opts");
    sc.options.forEach((o)=>{
      const b=el(`<button class="btn">${o.label}</button>`);
      b.onclick=()=>{
        const badges=applyEffects(o.effects||{});
        document.getElementById("fb").innerHTML=`<div class="outcome"><div class="verdict">${o.outcome}</div>
          ${badges.length?`<div class="effects">${badges.join("")}</div>`:""}
          <button class="btn small" id="cont">ДАЛЬШЕ</button></div>`;
        Array.from(opts.children).forEach(x=>x.disabled=true);
        document.getElementById("cont").onclick=()=>{ S.scene++; save(); renderScene(); };
      };
      opts.appendChild(b);
    });
  }

  else if(sc.type==="urls"){
    slot.appendChild(el(`<div class="card alert"><div class="par"><b>${sc.prompt}</b></div>
      <div class="exam-progress" id="url-round">раунд 1 из ${sc.rounds.length}</div>
      <div id="url-body"></div></div>`));
    let round=0, wrongTotal=0;
    function drawRound(){
      const r=sc.rounds[round];
      document.getElementById("url-round").textContent=`раунд ${round+1} из ${sc.rounds.length}`;
      const body=document.getElementById("url-body");
      body.innerHTML=`<div class="urls">
        <button class="btn" data-url="a">${r.a}</button>
        <button class="btn" data-url="b">${r.b}</button></div><div id="url-fb"></div>`;
      body.querySelectorAll("[data-url]").forEach(b=>{
        b.onclick=()=>{
          const ok = b.dataset.url===r.correct;
          if(!ok){ wrongTotal++; applyEffects({capital:-sc.penalty}); }
          body.querySelectorAll("[data-url]").forEach(x=>x.disabled=true);
          const fb=document.getElementById("url-fb");
          fb.innerHTML=`<div class="q-feedback ${ok?"":"wrong"}">${ok?sc.rightLine:sc.wrongLine}<br><span class="hl">${r.why}</span></div>
            <button class="btn small" id="next-url">${round<sc.rounds.length-1?"СЛЕДУЮЩИЙ РАУНД":"ЗАВЕРШИТЬ"}</button>`;
          document.getElementById("next-url").onclick=()=>{
            round++;
            if(round<sc.rounds.length) drawRound();
            else { S.scene++; save(); renderScene(); }
          };
        };
      });
    }
    drawRound();
  }

  else if(sc.type==="flags"){
    const itemsHtml=sc.items.map((it,i)=>`
      <button class="btn" data-flag="${i}">${it.label}</button>`).join("");
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>
      ${itemsHtml}
      <button class="btn primary" id="flags-go">ПОДТВЕРДИТЬ ВЫБОР</button>
      <div class="par small">Ошибка карается налогом: −${sc.penalty} USDT за каждый ложный флаг.</div>
      <div id="flags-fb"></div></div>`));
    const chosen=new Set();
    slot.querySelectorAll("[data-flag]").forEach(b=>{
      b.onclick=()=>{
        const i=b.dataset.flag;
        if(chosen.has(i)){ chosen.delete(i); b.style.background=""; b.style.color=""; }
        else { chosen.add(i); b.style.background="var(--amber)"; b.style.color="#000"; }
      };
    });
    document.getElementById("flags-go").onclick=()=>{
      let wrong=0, missed=0;
      const rows=sc.items.map((it,i)=>{
        const picked=chosen.has(i);
        let cls, verdict;
        if(it.isFlag && picked){ cls="ok"; verdict="Флаг найден."; }
        else if(it.isFlag && !picked){ cls="miss"; verdict=sc.missNote; missed++; }
        else if(!it.isFlag && picked){ cls="err"; verdict="Это не флаг. Это скучная норма. Налог за ложную тревогу."; wrong++; }
        else { cls="ok"; verdict="Верно оставлено в покое."; }
        return `<div class="q-feedback ${cls==="err"?"wrong":""}" style="${cls==="miss"?"border-left-color:var(--amber)":""}">
          <b>${it.label}</b><br>${verdict}<br><span class="hl">${it.why}</span></div>`;
      }).join("");
      if(wrong) applyEffects({capital:-(wrong*sc.penalty)});
      document.getElementById("flags-fb").innerHTML=rows+`
        <div class="outcome"><div class="verdict">${wrong===0&&missed===0
          ?"Идеально. Регуляторы гордятся вами. Они всё ещё обеспокоены, но уже по другому поводу."
          :`Найдено ${sc.items.filter((x,idx)=>x.isFlag&&chosen.has(String(idx))).length} из ${sc.items.filter(x=>x.isFlag).length} флагов. Ложных тревог: ${wrong}.`}
          </div><button class="btn small" id="next">ДАЛЬШЕ</button></div>`;
      slot.querySelectorAll("[data-flag],[id=flags-go]").forEach(x=>x.disabled=true);
      document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
  }

  else if(sc.type==="report"){
    const c=el(`<div class="card report"><span class="stamp amber">${sc.stamp||"АРХИВ"}</span>
      ${sc.paras.map(p=>`<div class="par">${p}</div>`).join("")}
      <button class="btn" id="dodge">${"ПРОПУСТИТЬ"}</button>
      <button class="btn primary" id="read-on" style="display:none">${sc.continueLabel}</button></div>`);
    slot.appendChild(c);
    const dodge=document.getElementById("dodge");
    let attempts=0;
    const dodgeMove=()=>{
      attempts++;
      if(attempts<=sc.skipJokes.length){
        dodge.textContent=sc.skipJokes[attempts-1];
        dodge.style.transform=`translate(${(Math.random()*160-80)|0}px,${(Math.random()*30-15)|0}px) rotate(${(Math.random()*8-4)|0}deg)`;
      } else {
        dodge.disabled=true; dodge.textContent="КНОПКА УВОЛЕНА. ЧИТАЙТЕ.";
        document.getElementById("read-on").style.display="block";
      }
    };
    dodge.onclick=dodgeMove;
    dodge.onmouseenter=dodgeMove;
    document.getElementById("read-on").onclick=()=>{
      slot.appendChild(el(`<div class="card"><div class="par">${sc.after}</div>
        <div class="par">${sc.after2}</div>
        <button class="btn small" id="next">ДАЛЬШЕ</button></div>`));
      document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
  }

  else if(sc.type==="exam"){
    drawExam(sc);
  }
}

/* ---------- экзамен ---------- */
function drawExam(sc){
  const slot=sceneSlot();
  slot.innerHTML="";
  const card=el(`<div class="card"><div class="kicker">УРОВЕНЬ 10 · ЭКЗАМЕН</div>
    <div class="headline">Пять вопросов. Четыре нужны.</div>
    <div class="par">${sc.intro}</div>
    <div class="exam-progress" id="exam-prog"></div>
    <div id="exam-body"></div></div>`);
  slot.appendChild(card);
  let qi=0, score=0;
  function drawQ(){
    document.getElementById("exam-prog").textContent=`вопрос ${qi+1} из ${sc.questions.length} · верно: ${score}`;
    const q=sc.questions[qi];
    const body=document.getElementById("exam-body");
    body.innerHTML=`<div class="par"><b>${q.q}</b></div>
      ${q.options.map((o,i)=>`<button class="btn" data-opt="${i}">${o}</button>`).join("")}
      <div id="exam-fb"></div>`;
    body.querySelectorAll("[data-opt]").forEach(b=>{
      b.onclick=()=>{
        const ok=+b.dataset.opt===q.correct;
        if(ok) score++;
        body.querySelectorAll("[data-opt]").forEach(x=>x.disabled=true);
        document.getElementById("exam-fb").innerHTML=`
          <div class="q-feedback ${ok?"":"wrong"}">${ok?"Верно.":"Неверно."} ${q.why}</div>
          <button class="btn small" id="exam-next">${qi<sc.questions.length-1?"СЛЕДУЮЩИЙ ВОПРОС":"РЕЗУЛЬТАТ"}</button>`;
        document.getElementById("exam-next").onclick=()=>{
          qi++;
          if(qi<sc.questions.length) drawQ();
          else finishExam(score,sc);
        };
      };
    });
  }
  drawQ();
}
function finishExam(score,sc){
  const slot=sceneSlot();
  slot.innerHTML="";
  if(score<sc.pass){
    slot.appendChild(el(`<div class="card alert"><div class="headline">ПЕРЕСДАЧА</div>
      <div class="par">Верно: ${score} из ${sc.questions.length}. Нужно ${sc.pass}.</div>
      <div class="par">Департамент управляемой паники даёт сколько угодно попыток. Рынок — ноль. Пользуйтесь разницей.</div>
      <button class="btn primary" id="retry">ПОПРОБОВАТЬ СНОВА</button></div>`));
    document.getElementById("retry").onclick=()=>drawExam(sc);
    return;
  }
  // аттестат
  S.chapterDone=true;
  S.status="выживший 0–10";
  save(); updateHUD();
  const verdict = S.faith>70?DIPLOMA_LINES.faithVerdict.high:(S.faith>40?DIPLOMA_LINES.faithVerdict.mid:DIPLOMA_LINES.faithVerdict.low);
  const arch=LEVELS[S.level].archive;
  slot.appendChild(el(`<div class="card archive" style="margin-bottom:16px"><span class="stamp amber">АРХИВ</span>
      <div class="fact">${arch.fact}</div><div class="src">${arch.src}</div><div class="note">${arch.note}</div></div>`));
  slot.appendChild(el(`<div class="diploma">

    <h2>${DIPLOMA_LINES.head}</h2>
    <div class="sub">${DIPLOMA_LINES.sub}</div>
    <div class="body">${DIPLOMA_LINES.body.map(p=>`<div class="par">${p}</div>`).join("")}</div>
    <div style="margin:18px 0">
      <div class="statline"><span>Верных ответов</span><b>${score} / ${sc.questions.length}</b></div>
      <div class="statline"><span>Остаток демо-капитала</span><b>${fmtCapital(S.capital)}</b></div>
      <div class="statline"><span>Индекс веры в график</span><b>${S.faith}%</b></div>
      <div class="statline"><span>Налог на надежду, уплаченный вами</span><b>${fmtCapital(1000-S.capital)}</b></div>
    </div>
    <div class="par">${verdict}</div>
    <button class="btn primary" id="to-map">В КАРТУ АРХИВА</button>
  </div>`));
  document.getElementById("to-map").onclick=()=>renderMap();
}

/* ---------- конец уровня: справка из архива ---------- */
function renderLevelEnd(){
  const L=LEVELS[S.level];
  screen.innerHTML="";
  screen.appendChild(el(`<div>
    <div class="card"><div class="kicker">УРОВЕНЬ ${L.no} ЗАВЕРШЁН</div>
      <div class="headline">Справка из архива</div></div>
    <div class="card archive"><span class="stamp amber">АРХИВ</span>
      <div class="fact">${L.archive.fact}</div>
      <div class="src">${L.archive.src}</div>
      <div class="note">${L.archive.note}</div></div>
    <button class="btn primary" id="next-level">${S.level<LEVELS.length-1
      ?`УРОВЕНЬ ${LEVELS[S.level+1].no}: ${LEVELS[S.level+1].title.split(":")[0]} →`
      :"К ЭКЗАМЕНУ →"}</button></div>`));
  document.getElementById("next-level").onclick=()=>{
    if(S.level<LEVELS.length-1){ S.level++; S.scene=0; save(); renderLevel(); }
  };
  updateHUD();
}

/* ---------- запуск ---------- */
buildTicker();
load();
updateStatusByLevel();
updateHUD();
renderTitle();
})();
