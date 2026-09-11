/* НАЛОГ НА НАДЕЖДУ — движок (vanilla JS, без зависимостей) */

(function(){
"use strict";

const SAVE_KEY = "nalog-na-nadezhdu-v2";
const OLD_KEY  = "nalog-na-nadezhdu-v1";
const screen = document.getElementById("screen");
const LEVEL_STARTS = [0, 11];   // индексы первых уровней реализованных глав

let S = {
  level: 0,          // индекс текущего уровня в LEVELS
  scene: 0,          // индекс сцены
  capital: 1000,
  faith: 100,
  status: "клиент приёмной",
  chaptersDone: [false, false],
  lastTrade: null,
  started: false
};

/* ---------- сохранение ---------- */
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  let raw=null;
  try{ raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(OLD_KEY); }catch(e){}
  if(!raw) return false;
  try{
    const d=JSON.parse(raw);
    S=Object.assign(S,d);
    if(!Array.isArray(S.chaptersDone)) S.chaptersDone=[!!d.chapterDone,false];
    S.chaptersDone=[!!S.chaptersDone[0],!!S.chaptersDone[1]];
    if(!S.lastTrade) S.lastTrade=null;
    if(!Number.isInteger(S.level)||S.level<0||S.level>=LEVELS.length) S.level=0;
    if(!Number.isInteger(S.scene)||S.scene<0) S.scene=0;
    return true;
  }catch(e){ return false; }
}

/* ---------- утилиты ---------- */
const el = html => { const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstElementChild; };
const fmtCapital = v => (Math.round(v*10)/10).toLocaleString("ru-RU")+" USDT";
function chapterOf(no){ return no<=10?1:no<=20?2:no<=35?3:no<=50?4:no<=65?5:no<=80?6:no<=90?7:8; }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

function applyEffects(effects){
  const badges=[];
  if(effects.capital){
    S.capital=Math.max(0,S.capital+effects.capital);
    const lbl=effects.label||"налог на надежду";
    badges.push(`<span class="effect ${effects.capital<0?'neg':'pos'}">${effects.capital<0?'−':'+'}${Math.abs(effects.capital)} USDT · ${lbl}</span>`);
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
  if(S.chaptersDone[1]) S.status="считающий издержки";
  else if(S.level>=11) S.status="гость машины комиссий";
  else if(S.chaptersDone[0]) S.status="выживший 0–10";
  else S.status = S.level>=9?"подписавший":(S.level>=5?"бдительный новичок":"клиент приёмной");
}
function updateHUD(){
  updateStatusByLevel();
  document.getElementById("hud-level").textContent = LEVELS[Math.min(S.level,LEVELS.length-1)].no+"/99";
  document.getElementById("hud-capital").textContent = fmtCapital(S.capital);
  const fEl=document.getElementById("hud-faith");
  fEl.textContent=S.faith+"%";
  fEl.className="hud-value "+(S.faith>70?"bad":(S.faith>40?"":"good"));
  document.getElementById("hud-status").textContent=S.status;
}

/* ---------- бегущая строка ---------- */
function buildTicker(){
  const track=document.getElementById("ticker-track");
  const items=TICKER.map(t=>`<span>${t}</span><span class="t-sep">✕</span>`).join("");
  track.innerHTML=items+items;
}

/* ================= ЭКРАНЫ ================= */

function renderTitle(){
  const hasSave = S.started && (S.level>0 || S.chaptersDone[0] || S.chaptersDone[1]);
  screen.innerHTML="";
  screen.appendChild(el(`
    <div class="title-screen">
      <div class="card">
        <div class="kicker">СЛУЖБА ПО ПЕРЕРАСПРЕДЕЛЕНИЮ ЧУЖИХ ДЕНЕГ ПРЕДСТАВЛЯЕТ</div>
        <div class="headline">Сатирическая обучающая игра о&nbsp;криптотрейдинге</div>
        <div class="par">Уровни 0–99. Восемь глав. Открыты две: «Приёмная» и «Биржа и исполнение».
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
  if(rb) rb.onclick=()=>{ try{ localStorage.removeItem(SAVE_KEY); localStorage.removeItem(OLD_KEY); }catch(e){}
    S={level:0,scene:0,capital:1000,faith:100,status:"клиент приёмной",chaptersDone:[false,false],lastTrade:null,started:false};
    renderTitle(); updateHUD(); };
}

/* ---------- карта глав ---------- */
function renderMap(){
  screen.innerHTML="";
  const wrap=el(`<div><div class="card"><div class="kicker">КАРТА АРХИВА</div>
    <div class="headline">Восемь глав до просветления</div>
    <div class="par">Каждая глава — макроблок учебной системы 0–99. Внутри — уровни, механики и справки из архива.
    Открыто: «Приёмная» и «Биржа и исполнение». Остальные запечатаны: департамент управляемой паники
    работает над рассекречиванием. Не быстро.</div></div></div>`);
  CHAPTERS.forEach((ch,i)=>{
    const unlocked = (i===0) || S.chaptersDone[i-1];
    const done = !!S.chaptersDone[i];
    const implemented = i < LEVEL_STARTS.length;
    const cls = done?"done":(unlocked&&implemented?"current":"locked");
    const tag = done?"ПРОЙДЕНА":(unlocked?(implemented?"ДОСТУПНО":"РАССЕКРЕЧИВАЕТСЯ"):ch.tag);
    const c=el(`<div class="chapter ${cls}">
      <div class="ch-no">${ch.no}</div>
      <div><div class="ch-title">Глава ${i+1}. ${ch.title}</div>
      <div class="ch-tease">${ch.tease}</div>
      <span class="ch-tag">${tag}</span></div></div>`);
    if(unlocked&&implemented) c.onclick=()=>{ S.level=LEVEL_STARTS[i]; S.scene=0; save(); renderLevel(); };
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
  screen.appendChild(el(`<div>
    <div class="card"><div class="kicker">ГЛАВА ${chapterOf(L.no)} · УРОВЕНЬ ${L.no} ИЗ 99</div>
    <div class="headline">${L.title}</div></div>
    <div id="scene-slot"></div></div>`));
  renderScene();
  updateHUD();
}

function sceneSlot(){ return document.getElementById("scene-slot"); }

/* ---------- общая обвязка для choice/sign ---------- */
function bindOptions(slotRoot, sc){
  const opts=slotRoot.querySelector("#opts");
  sc.options.forEach((o)=>{
    const b=el(`<button class="btn">${o.label}</button>`);
    b.onclick=()=>{
      const badges=applyEffects(o.effects||{});
      slotRoot.querySelector("#fb").innerHTML=`<div class="outcome"><div class="verdict">${o.outcome}</div>
        ${badges.length?`<div class="effects">${badges.join("")}</div>`:""}
        <button class="btn small" id="cont">ДАЛЬШЕ</button></div>`;
      Array.from(opts.children).forEach(x=>x.disabled=true);
      slotRoot.querySelector("#cont").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
    opts.appendChild(b);
  });
}

function renderScene(){
  const L=LEVELS[S.level];
  const sc=L.scenes[S.scene];
  const slot=sceneSlot();
  slot.innerHTML="";
  if(!sc){ renderLevelEnd(); return; }

  /* --- текст --- */
  if(sc.type==="text"){
    slot.appendChild(el(`<div class="card"><div class="par">${sc.paras.join("</div><div class='par'>")}</div>
      <button class="btn small" id="next">ДАЛЬШЕ</button></div>`));
    document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
  }

  /* --- выбор (глава 1) --- */
  else if(sc.type==="choice"){
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div><div id="opts"></div><div id="fb"></div></div>`));
    bindOptions(slot, sc);
  }

  /* --- подпись документа --- */
  else if(sc.type==="sign"){
    slot.appendChild(el(`<div class="card report"><div class="par"><b>${sc.prompt}</b></div>
      <div class="outcome" style="border-style:solid"><div class="verdict">${sc.doc}</div></div>
      <div id="opts"></div><div id="fb"></div></div>`));
    bindOptions(slot, sc);
  }

  /* --- фишинг: выбор домена --- */
  else if(sc.type==="urls"){
    slot.appendChild(el(`<div class="card alert"><div class="par"><b>${sc.prompt}</b></div>
      <div class="exam-progress" id="url-round">раунд 1 из ${sc.rounds.length}</div>
      <div id="url-body"></div></div>`));
    let round=0;
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
          if(!ok) applyEffects({capital:-sc.penalty});
          body.querySelectorAll("[data-url]").forEach(x=>x.disabled=true);
          document.getElementById("url-fb").innerHTML=`
            <div class="q-feedback ${ok?"":"wrong"}">${ok?sc.rightLine:sc.wrongLine}<br><span class="hl">${r.why}</span></div>
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

  /* --- мини-игра «красные флаги» --- */
  else if(sc.type==="flags"){
    const itemsHtml=sc.items.map((it,i)=>`<button class="btn" data-flag="${i}">${it.label}</button>`).join("");
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
      let wrong=0, missed=0, found=0;
      const total=sc.items.filter(x=>x.isFlag).length;
      const rows=sc.items.map((it,i)=>{
        const picked=chosen.has(i);
        let cls, verdict;
        if(it.isFlag && picked){ cls="ok"; verdict="Флаг найден."; found++; }
        else if(it.isFlag && !picked){ cls="miss"; verdict=sc.missNote; missed++; }
        else if(!it.isFlag && picked){ cls="err"; verdict="Это не флаг. Это скучная норма. Налог за ложную тревогу."; wrong++; }
        else { cls="ok"; verdict="Верно оставлено в покое."; }
        return `<div class="q-feedback ${cls==="err"?"wrong":""}" style="${cls==="miss"?"border-left-color:var(--amber)":""}">
          <b>${it.label}</b><br>${verdict}<br><span class="hl">${it.why}</span></div>`;
      }).join("");
      if(wrong) applyEffects({capital:-(wrong*sc.penalty),label:"налог за ложную тревогу"});
      document.getElementById("flags-fb").innerHTML=rows+`
        <div class="outcome"><div class="verdict">${wrong===0&&missed===0
          ?"Идеально. Регуляторы гордятся вами. Они всё ещё обеспокоены, но уже по другому поводу."
          :`Найдено ${found} из ${total} флагов. Ложных тревог: ${wrong}.`}
          </div><button class="btn small" id="next">ДАЛЬШЕ</button></div>`;
      slot.querySelectorAll("[data-flag],#flags-go").forEach(x=>x.disabled=true);
      document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
  }

  /* --- отчёт с убегающей кнопкой --- */
  else if(sc.type==="report"){
    const c=el(`<div class="card report"><span class="stamp amber">${sc.stamp||"АРХИВ"}</span>
      ${sc.paras.map(p=>`<div class="par">${p}</div>`).join("")}
      <button class="btn" id="dodge">ПРОПУСТИТЬ</button>
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

  /* --- стакан + вопрос --- */
  else if(sc.type==="orderbook"){
    const asksHtml=sc.book.asks.map(a=>`<div class="ob-row ask"><span>${a.p.toFixed(2)}</span><span>${a.q}</span></div>`).join("");
    const bidsHtml=sc.book.bids.map(b=>`<div class="ob-row bid"><span>${b.p.toFixed(2)}</span><span>${b.q}</span></div>`).join("");
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>
      <div class="ob">
        <div class="ob-head"><span>ЦЕНА (ASK — продажа)</span><span>ОБЪЁМ</span></div>
        ${asksHtml}<div class="ob-spread">СПРЕД ${sc.book.spread}</div>${bidsHtml}
      </div>
      <div class="par small">${sc.note}</div>
      <div id="ob-q"></div></div>`));
    const qEl=document.getElementById("ob-q");
    qEl.innerHTML=`<div class="par"><b>${sc.question}</b></div>`+
      sc.options.map((o,i)=>`<button class="btn" data-ob="${i}">${o.label}</button>`).join("")+
      `<div id="ob-fb"></div>`;
    qEl.querySelectorAll("[data-ob]").forEach(b=>{
      b.onclick=()=>{
        const ok=+b.dataset.ob===sc.correct;
        if(!ok) applyEffects({capital:-sc.penalty,label:"налог на арифметику"});
        qEl.querySelectorAll("[data-ob]").forEach(x=>x.disabled=true);
        document.getElementById("ob-fb").innerHTML=`
          <div class="q-feedback ${ok?"":"wrong"}">${ok?sc.rightLine:sc.wrongLine}<br><span class="hl">${sc.why}</span></div>
          <button class="btn small" id="next">ДАЛЬШЕ</button>`;
        document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
      };
    });
  }

  /* --- калькулятор плеча/ликвидации --- */
  else if(sc.type==="leverage"){
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>
      <div class="par small">Вход в лонг по ${sc.entry} USDT. Выбирай плечо — смотри цену ликвидации. Это бесплатный просмотр. В жизни — платный.</div>
      <div class="lev-btns">${sc.levs.map(l=>`<button class="btn small" data-lev="${l}">${l}x</button>`).join("")}</div>
      <div id="lev-out"><div class="par small">Плечо пока не выбрано. Как и в жизни — до первого раза.</div></div>
      <div id="lev-q"></div></div>`));
    slot.querySelectorAll("[data-lev]").forEach(b=>{
      b.onclick=()=>{
        const lev=+b.dataset.lev;
        const dist=100/lev;
        const liq=(sc.entry*(1-dist/100)).toFixed(2);
        const mood = dist<=2 ? "Запас прочности: один чих. Департамент управляемой паники аплодирует."
          : dist<=5 ? "Запас: одна средняя новость."
          : dist<=10 ? "Запас: один плохой день. На этом рынке это уже роскошь."
          : "Запас: месяцы спокойствия. Скучно. Правильно.";
        document.getElementById("lev-out").innerHTML=`<div class="outcome"><div class="verdict">
          ПЛЕЧО ${lev}x · ВХОД ${sc.entry} USDT<br>Цена ликвидации ≈ <b>${liq}</b> (−${dist}% от входа)<br>${mood}</div></div>`;
        const q=document.getElementById("lev-q");
        q.innerHTML=`<div class="par"><b>${sc.question}</b></div>`+
          sc.options.map((o,i)=>`<button class="btn" data-lq="${i}">${o.label}</button>`).join("")+
          `<div id="lev-fb"></div>`;
        q.querySelectorAll("[data-lq]").forEach(qb=>{
          qb.onclick=()=>{
            const ok=+qb.dataset.lq===sc.correct;
            if(!ok) applyEffects({capital:-sc.penalty,label:"налог на арифметику"});
            q.querySelectorAll("[data-lq]").forEach(x=>x.disabled=true);
            document.getElementById("lev-fb").innerHTML=`
              <div class="q-feedback ${ok?"":"wrong"}">${ok?sc.rightLine:sc.wrongLine}<br><span class="hl">${sc.why}</span></div>
              <button class="btn small" id="next">ДАЛЬШЕ</button>`;
            document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
          };
        });
      };
    });
  }

  /* --- вскрытие правды (демо vs реальность) --- */
  else if(sc.type==="reveal"){
    const rows=sc.rows.map((r,i)=>`<div class="rev" data-rev="${i}">
      <div class="rev-t">${r.title} <span class="rev-hint">[нажми, чтобы вскрыть]</span></div>
      <div class="rev-b" style="display:none">
        <div class="par small"><b>ДЕМО:</b> ${r.demo}</div>
        <div class="par small"><b>РЕАЛЬНОСТЬ:</b> <span class="warn">${r.real}</span></div>
      </div></div>`).join("");
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>${rows}
      <div id="rev-next" style="display:none"></div></div>`));
    let opened=0;
    slot.querySelectorAll("[data-rev]").forEach(rv=>{
      rv.onclick=()=>{
        const body=rv.querySelector(".rev-b");
        if(body.style.display==="none"){
          body.style.display="block";
          rv.querySelector(".rev-hint").textContent="";
          rv.classList.add("open");
          opened++;
          if(opened>=sc.rows.length){
            const rn=document.getElementById("rev-next");
            rn.style.display="block";
            rn.innerHTML=`<div class="par">${sc.after}</div><button class="btn small" id="next">ДАЛЬШЕ</button>`;
            document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
          }
        }
      };
    });
  }

  /* --- дневник сделки --- */
  else if(sc.type==="journal"){
    const lt=S.lastTrade;
    const ltHtml=lt?`<div class="outcome" style="border-style:solid"><div class="verdict">ПОСЛЕДНЯЯ СДЕЛКА СЕССИИ:
      вход ${lt.entry}, выход ${lt.exit}, P&amp;L ${lt.pnl>=0?"+":""}${lt.pnl} USDT, комиссии ${lt.fees} USDT</div></div>`
      :`<div class="par small">Сессия не найдена в архиве. Заполняй по памяти. Память — горячий кошелёк с плохим аптаймом.</div>`;
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>${ltHtml}
      ${sc.fields.map((f,fi)=>`<div class="jfield"><div class="par small"><b>${f.label}</b></div>
        <select class="j-sel" data-j="${fi}">${f.options.map((o,oi)=>`<option value="${oi}">${o.label}</option>`).join("")}</select></div>`).join("")}
      <button class="btn primary" id="j-go">ЗАПОЛНИТЬ И ЗАКРЫТЬ ДЕНЬ</button>
      <div class="par small">Пиши честно. Дневник читают только ты и статистика.</div>
      <div id="j-fb"></div></div>`));
    document.getElementById("j-go").onclick=()=>{
      let good=0;
      sc.fields.forEach((f,fi)=>{
        const sel=slot.querySelector(`[data-j="${fi}"]`);
        if(f.options[+sel.value].good) good++;
      });
      const allGood = good===sc.fields.length;
      const bad=sc.fields.length-good;
      if(allGood) applyEffects({faith:-5});
      else if(bad) applyEffects({faith:-(bad*3)});
      document.getElementById("j-fb").innerHTML=`<div class="outcome"><div class="verdict">
        ${allGood?sc.verdictGood:sc.verdictBad}</div>
        <button class="btn small" id="next">ДАЛЬШЕ</button></div>`;
      slot.querySelectorAll(".j-sel,#j-go").forEach(x=>x.disabled=true);
      document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
  }

  /* --- торговый симулятор --- */
  else if(sc.type==="tradesim"){
    const rng=mulberry32(sc.seed);
    let price=sc.startPrice, pos=null, closes=0, feesTotal=0, pnlTotal=0, tick=0;
    slot.appendChild(el(`<div class="card"><div class="par"><b>${sc.prompt}</b></div>
      <div class="sim">
        <div class="sim-price" id="ts-price">${price.toFixed(2)}</div>
        <div class="par small" id="ts-pos"></div>
        <div class="sim-btns">
          <button class="btn small" id="ts-tick">ТИК ЦЕНЫ</button>
          <button class="btn small" id="ts-buy">КУПИТЬ НА ${sc.size} USDT</button>
          <button class="btn small" id="ts-sell" disabled>ЗАКРЫТЬ ПОЗИЦИЮ</button>
        </div>
        <div class="par small" id="ts-log">Сессия открыта. Цена случайна. Как настоящая — только честнее.</div>
        <div class="par small" id="ts-count"></div>
        <button class="btn primary" id="ts-finish" disabled>ЗАВЕРШИТЬ СЕССИЮ</button>
      </div><div id="ts-fb"></div></div>`));
    const fee=()=>sc.size*sc.feePct/100;
    function upd(){
      document.getElementById("ts-price").textContent=price.toFixed(2);
      document.getElementById("ts-count").textContent=`закрытых сделок: ${closes}/${sc.needCloses} · комиссии уплачено: ${feesTotal.toFixed(2)} USDT`;
      document.getElementById("ts-pos").textContent=pos
        ?`ЛОНГ: вход ${pos.entry.toFixed(2)}, объём ${sc.size} USDT, плавающий P&L ${((price-pos.entry)*sc.size/pos.entry).toFixed(2)} USDT`
        :`Позиции нет. Кошелёк сессии: ${(sc.wallet+pnlTotal).toFixed(2)} USDT`;
      document.getElementById("ts-buy").disabled=!!pos;
      document.getElementById("ts-sell").disabled=!pos;
      document.getElementById("ts-finish").disabled=closes<sc.needCloses;
    }
    upd();
    document.getElementById("ts-tick").onclick=()=>{
      tick++;
      price=price*(1+((rng()*2-1)*sc.tickPct)/100);
      document.getElementById("ts-log").textContent=sc.tickLines[(tick-1)%sc.tickLines.length];
      upd();
    };
    document.getElementById("ts-buy").onclick=()=>{
      pos={entry:price};
      const f=fee(); feesTotal+=f; pnlTotal-=f;
      document.getElementById("ts-log").textContent=`Купил по ${price.toFixed(2)}. Комиссия taker: −${f.toFixed(2)} USDT. Она не спрашивает, зачем ты это сделал.`;
      upd();
    };
    document.getElementById("ts-sell").onclick=()=>{
      const qty=sc.size/pos.entry;
      const gross=(price-pos.entry)*qty;
      const f=fee(); feesTotal+=f; pnlTotal+=gross-f;
      closes++;
      S.lastTrade={entry:+pos.entry.toFixed(2), exit:+price.toFixed(2),
        pnl:+(gross-2*fee()).toFixed(2), fees:+(2*fee()).toFixed(2)};
      pos=null; save();
      document.getElementById("ts-log").textContent=`Закрыл по ${price.toFixed(2)}. P&L сделки: ${S.lastTrade.pnl>=0?"+":""}${S.lastTrade.pnl} USDT (включая комиссии ${S.lastTrade.fees}).`;
      upd();
    };
    document.getElementById("ts-finish").onclick=()=>{
      const net=Math.round(pnlTotal*100)/100;
      applyEffects({capital:net,label:"итог демо-сессии",faith:-5});
      const line = net>0.005?sc.lines.win:(net<-0.005?sc.lines.lose:sc.lines.zero);
      const txt=line.replace("{pnl}",(net>=0?"+":"")+net.toFixed(2)).replace("{fees}",feesTotal.toFixed(2));
      document.getElementById("ts-fb").innerHTML=`<div class="outcome"><div class="verdict">${txt}</div>
        <div class="effects"><span class="effect ${net>=0?'pos':'neg'}">${net>=0?"+":""}${net.toFixed(2)} USDT · демо-сессия перенесена в капитал</span></div>
        <button class="btn small" id="next">ДАЛЬШЕ</button></div>`;
      ["ts-tick","ts-buy","ts-sell","ts-finish"].forEach(id=>document.getElementById(id).disabled=true);
      document.getElementById("next").onclick=()=>{ S.scene++; save(); renderScene(); };
    };
  }

  /* --- экзамен --- */
  else if(sc.type==="exam"){
    drawExam(sc);
  }
}

/* ---------- экзамен ---------- */
function drawExam(sc){
  const slot=sceneSlot();
  slot.innerHTML="";
  slot.appendChild(el(`<div class="card"><div class="kicker">УРОВЕНЬ ${LEVELS[S.level].no} · ЭКЗАМЕН</div>
    <div class="headline">${sc.headline||"Пять вопросов. Четыре нужны."}</div>
    <div class="par">${sc.intro}</div>
    <div class="exam-progress" id="exam-prog"></div>
    <div id="exam-body"></div></div>`));
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
  const ch = sc.chapter || chapterOf(LEVELS[S.level].no);
  S.chaptersDone[ch-1]=true;
  save(); updateHUD();
  const D = ch===2?DIPLOMA2:DIPLOMA_LINES;
  const verdict = S.faith>70?D.faithVerdict.high:(S.faith>40?D.faithVerdict.mid:D.faithVerdict.low);
  const arch=LEVELS[S.level].archive;
  slot.appendChild(el(`<div class="card archive" style="margin-bottom:16px"><span class="stamp amber">АРХИВ</span>
      <div class="fact">${arch.fact}</div><div class="src">${arch.src}</div><div class="note">${arch.note}</div></div>`));
  slot.appendChild(el(`<div class="diploma">
    <h2>${D.head}</h2>
    <div class="sub">${D.sub}</div>
    <div class="body">${D.body.map(p=>`<div class="par">${p}</div>`).join("")}</div>
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
  const next=LEVELS[S.level+1];
  screen.appendChild(el(`<div>
    <div class="card"><div class="kicker">УРОВЕНЬ ${L.no} ЗАВЕРШЁН</div>
      <div class="headline">Справка из архива</div></div>
    <div class="card archive"><span class="stamp amber">АРХИВ</span>
      <div class="fact">${L.archive.fact}</div>
      <div class="src">${L.archive.src}</div>
      <div class="note">${L.archive.note}</div></div>
    ${next?`<button class="btn primary" id="next-level">УРОВЕНЬ ${next.no}: ${next.title.split(":")[0]} →</button>`:""}
    </div>`));
  const nb=document.getElementById("next-level");
  if(nb) nb.onclick=()=>{ S.level++; S.scene=0; save(); renderLevel(); };
  updateHUD();
}

/* ---------- запуск ---------- */
buildTicker();
load();
updateHUD();
renderTitle();
})();
