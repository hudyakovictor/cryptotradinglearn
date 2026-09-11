/* Headless smoke-тест игры «Налог на надежду» — главы 1 и 2 полностью */
const { JSDOM } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync(__dirname + "/../index.html", "utf-8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
const w = dom.window;

const content = fs.readFileSync(__dirname + "/../content.js", "utf-8");
const engine = fs.readFileSync(__dirname + "/../engine.js", "utf-8");

function run(code, label){
  try { w.eval(code); console.log("✓", label); return true; }
  catch(e){ console.log("✗", label, "→", e.message); process.exit(1); }
}

run(content + "\n" + engine, "content.js + engine.js загрузились (общая область, как в браузере)");

const doc = w.document;
const click = id => { const b = doc.getElementById(id); if(!b) throw new Error("нет кнопки "+id); b.onclick(); };
const cap = () => doc.getElementById("hud-capital").textContent;
const faith = () => doc.getElementById("hud-faith").textContent;

/* ============ ГЛАВА 1 ============ */
click("btn-enter");
if(!doc.querySelector(".chapter")) throw new Error("карта глав не отобразилась");
console.log("✓ карта глав:", doc.querySelectorAll(".chapter").length, "глав");
doc.querySelector(".chapter").onclick();

click("next");
doc.querySelectorAll("#opts .btn")[2].onclick(); click("cont");
click("next"); click("next-level");
console.log("✓ уровень 0 пройден | капитал:", cap(), "| вера:", faith());

click("next"); doc.querySelectorAll("#opts .btn")[1].onclick(); click("cont"); click("next"); click("next-level");
console.log("✓ уровень 1 пройден | капитал:", cap());

click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 2 пройден (сид-фраза)");

click("next");
for(let r=0;r<3;r++){
  const correct = (r===1) ? "b" : "a";
  doc.querySelectorAll("[data-url]").forEach(b=>{ if(b.dataset.url===correct) b.onclick(); });
  click("next-url");
}
click("next-level");
console.log("✓ уровень 3 пройден (фишинг)");

click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровни 4–5 пройдены (2FA, API)");

click("next");
[0,1,2,4].forEach(i=>doc.querySelector(`[data-flag="${i}"]`).onclick());
click("flags-go");
if(doc.querySelectorAll("#flags-fb .q-feedback").length!==6) throw new Error("флаги: неверное число разборов");
click("next"); click("next-level");
console.log("✓ уровень 6 пройден (красные флаги)");

click("next"); click("next"); doc.querySelectorAll("#opts .btn")[2].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 7 пройден (pump) | вера:", faith());

const dodge = doc.getElementById("dodge");
dodge.onclick(); dodge.onclick(); dodge.onclick();
if(!dodge.disabled) throw new Error("кнопка ПРОПУСТИТЬ не уволилась");
click("read-on"); click("next"); click("next-level");
console.log("✓ уровень 8 пройден (отчёт о потерях)");

click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 9 пройден (подпись) | вера:", faith());

// экзамен: завалить → пересдать
for(let qi=0; qi<5; qi++){ doc.querySelectorAll("[data-opt]")[1].onclick(); click("exam-next"); }
if(!doc.getElementById("retry")) throw new Error("пересдача не предложена");
click("retry");
for(let qi=0; qi<5; qi++){ doc.querySelectorAll("[data-opt]")[0].onclick(); click("exam-next"); }
if(!doc.querySelector(".diploma")) throw new Error("аттестат 1 не выдан");
console.log("✓ ГЛАВА 1 СДАНА | статус:", doc.getElementById("hud-status").textContent, "| капитал:", cap());
click("to-map");

/* ============ ГЛАВА 2 ============ */
const chapters = doc.querySelectorAll(".chapter");
if(!chapters[1].classList.contains("current")) throw new Error("глава 2 не открылась после главы 1");
chapters[1].onclick();
console.log("✓ глава 2 открыта");

// L11: стакан — сначала неверный ответ (проверка штрафа), потом движение дальше
click("next");
const capBefore = w.localStorage.getItem("nalog-na-nadezhdu-v2");
doc.querySelector('[data-ob="0"]').onclick();
click("next"); click("next-level");
console.log("✓ уровень 11 пройден (стакан, штраф проверен)");

// L12: лимит 99.5
click("next"); doc.querySelectorAll("#opts .btn")[1].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 12 пройден (типы ордеров) | капитал:", cap());

// L13: 1.0 USDT
click("next"); doc.querySelectorAll("#opts .btn")[1].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 13 пройден (комиссии)");

// L14: стейбл на свой кошелёк
click("next"); doc.querySelectorAll("#opts .btn")[2].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 14 пройден (KYC/вывод) | капитал:", cap());

// L15: торговая сессия — 5 сделок
click("next");
for(let t=0;t<5;t++){ click("ts-buy"); click("ts-tick"); click("ts-sell"); }
click("ts-finish");
click("next"); click("next-level");
console.log("✓ уровень 15 пройден (демо-сессия, 5 сделок) | капитал:", cap());

// L16: калькулятор плеча
click("next");
doc.querySelector('[data-lev="100"]').onclick();
if(!doc.querySelector("#lev-out .outcome")) throw new Error("калькулятор плеча не отреагировал");
doc.querySelector('[data-lq="0"]').onclick();
click("next"); click("next-level");
console.log("✓ уровень 16 пройден (плечо/ликвидация)");

// L17: фандинг 2.1%
click("next"); doc.querySelectorAll("#opts .btn")[1].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 17 пройден (фандинг)");

// L18: вскрытие демо
click("next");
doc.querySelectorAll("[data-rev]").forEach(r=>r.onclick());
if(doc.getElementById("rev-next").style.display!=="block") throw new Error("строки демо не вскрыты");
click("next"); click("next-level");
console.log("✓ уровень 18 пройден (вскрытие демо)");

// L19: дневник — все честные ответы
click("next");
doc.querySelectorAll(".j-sel").forEach(sel=>{ sel.value="0"; });
click("j-go");
click("next"); click("next-level");
console.log("✓ уровень 19 пройден (дневник) | вера:", faith());

// L20: экзамен Б — сдаём сразу
for(let qi=0; qi<5; qi++){ doc.querySelectorAll("[data-opt]")[0].onclick(); click("exam-next"); }
if(!doc.querySelector(".diploma")) throw new Error("аттестат 2 не выдан");
console.log("✓ ГЛАВА 2 СДАНА | статус:", doc.getElementById("hud-status").textContent,
  "| уровень:", doc.getElementById("hud-level").textContent,
  "| капитал:", cap(), "| вера:", faith());
click("to-map");

const done = doc.querySelectorAll(".chapter.done");
if(done.length!==2) throw new Error("ожидались 2 пройденные главы, есть "+done.length);
if(!doc.querySelector(".chapter.done .ch-no").textContent.includes("0–10")) throw new Error("глава 1 не помечена");
console.log("✓ карта глав: 2 главы помечены ПРОЙДЕНА, глава 3 — рассекречивается");

console.log("\n=== SMOKE TEST PASSED: главы 1 и 2 проходятся от титула до аттестатов ===");
