/* Headless smoke-тест игры «Налог на надежду» */
const { JSDOM } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync("/home/user/cryptotradinglearn/game/index.html", "utf-8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
const w = dom.window;

w.document.getElementById = w.document.getElementById.bind(w.document);
// localStorage уже есть в jsdom

// загружаем контент и движок как скрипты
const content = fs.readFileSync("/home/user/cryptotradinglearn/game/content.js", "utf-8");
const engine = fs.readFileSync("/home/user/cryptotradinglearn/game/engine.js", "utf-8");

function run(code, label){
  try { w.eval(code); console.log("✓", label); return true; }
  catch(e){ console.log("✗", label, "→", e.message); return false; }
}

if(!run(content + "\n" + engine, "content.js + engine.js загрузились (общая область, как в браузере)")) process.exit(1);

const doc = w.document;
const click = id => { const b = doc.getElementById(id); if(!b) throw new Error("нет кнопки "+id); b.onclick(); };

// --- титул → вход
click("btn-enter");
console.log("✓ вход в систему, экран:", doc.querySelector(".title-screen") ? "титул" : "карта глав");
if(!doc.querySelector(".chapter")) throw new Error("карта глав не отобразилась");
console.log("✓ карта глав:", doc.querySelectorAll(".chapter").length, "глав");

// --- глава 1 → уровень 0
doc.querySelector(".chapter").onclick();
if(!doc.getElementById("scene-slot")) throw new Error("уровень не открылся");
console.log("✓ уровень 0 открыт");

// --- проход уровня 0: сцена text → choice → text → archive
click("next"); // text
const optBtns = doc.querySelectorAll("#opts .btn");
if(optBtns.length !== 3) throw new Error("ожидалось 3 опции, есть "+optBtns.length);
optBtns[2].onclick(); // «мне интересно»
click("cont");
click("next");
click("next-level"); // к уровню 1
console.log("✓ уровень 0 пройден, HUD-капитал:", doc.getElementById("hud-capital").textContent,
  "вера:", doc.getElementById("hud-faith").textContent);

// --- уровень 1: text → choice → text → next-level
click("next");
doc.querySelectorAll("#opts .btn")[1].onclick();
click("cont"); click("next"); click("next-level");
console.log("✓ уровень 1 пройден, капитал:", doc.getElementById("hud-capital").textContent);

// --- уровень 2 (сид-фраза): правильный ответ
click("next");
doc.querySelectorAll("#opts .btn")[0].onclick();
click("cont"); click("next-level");
console.log("✓ уровень 2 пройден (бумага), капитал:", doc.getElementById("hud-capital").textContent);

// --- уровень 3 (фишинг): 3 раунда, правильные ответы
click("next");
for(let r=0;r<3;r++){
  const urlBtns = doc.querySelectorAll("[data-url]");
  if(urlBtns.length!==2) throw new Error("раунд "+r+": нет пары URL");
  // найдём правильный по content.js: раунд1 a, раунд2 b, раунд3 a
  const correct = (r===1) ? "b" : "a";
  urlBtns.forEach(b=>{ if(b.dataset.url===correct) b.onclick(); });
  click("next-url");
}
click("next-level");
console.log("✓ уровень 3 пройден (3 раунда фишинга)");

// --- уровень 4 (2FA): app
click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 4 пройден");

// --- уровень 5 (API): чтение
click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 5 пройден");

// --- уровень 6 (флаги): выбрать 4 флага (индексы 0,1,2,4)
click("next");
[0,1,2,4].forEach(i=>doc.querySelector(`[data-flag="${i}"]`).onclick());
click("flags-go");
const fbCount = doc.querySelectorAll("#flags-fb .q-feedback").length;
if(fbCount!==6) throw new Error("ожидалось 6 разборов, есть "+fbCount);
click("next"); click("next-level");
console.log("✓ уровень 6 пройден (флаги), капитал:", doc.getElementById("hud-capital").textContent);

// --- уровень 7 (pump): пропустить
click("next"); click("next"); doc.querySelectorAll("#opts .btn")[2].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 7 пройден, вера:", doc.getElementById("hud-faith").textContent);

// --- уровень 8 (отчёт): кнопка увольняется после 2 попыток
const dodge = doc.getElementById("dodge");
dodge.onclick(); dodge.onclick(); dodge.onclick();
if(!dodge.disabled) throw new Error("кнопка ПРОПУСТИТЬ не уволилась");
click("read-on"); click("next"); click("next-level");
console.log("✓ уровень 8 пройден (отчёт о потерях)");

// --- уровень 9 (подпись): просто подписать
click("next"); doc.querySelectorAll("#opts .btn")[0].onclick(); click("cont"); click("next-level");
console.log("✓ уровень 9 пройден, вера:", doc.getElementById("hud-faith").textContent);

// --- уровень 10: экзамен. Сначала завалить (1 верный), потом пересдать на 5/5
// level10 scenes[0] = exam, отдельной text-сцены нет
let examBody = doc.getElementById("exam-body");
if(!examBody) throw new Error("экзамен не открылся");
// завальная попытка: все ответы 1 (верен только вопрос 1? нет — правильные все 0) → 0 верных
for(let qi=0; qi<5; qi++){
  const opts = doc.querySelectorAll("[data-opt]");
  opts[1].onclick(); // неверный везде
  click("exam-next");
}
if(!doc.getElementById("retry")) throw new Error("пересдача не предложена");
console.log("✓ экзамен завален корректно, пересдача доступна");
click("retry");
for(let qi=0; qi<5; qi++){
  doc.querySelectorAll("[data-opt]")[0].onclick(); // правильный ответ = 0 везде
  click("exam-next");
}
const dip = doc.querySelector(".diploma");
if(!dip) throw new Error("аттестат не выдан");
console.log("✓ ЭКЗАМЕН СДАН, аттестат получен");
console.log("  статус:", doc.getElementById("hud-status").textContent,
  "| уровень:", doc.getElementById("hud-level").textContent,
  "| капитал:", doc.getElementById("hud-capital").textContent,
  "| вера:", doc.getElementById("hud-faith").textContent);
click("to-map");
const doneCh = doc.querySelector(".chapter.done");
if(!doneCh) throw new Error("глава 1 не помечена пройденной");
console.log("✓ карта глав: глава 1 помечена ПРОЙДЕНА");

console.log("\n=== SMOKE TEST PASSED: игра проходима от титула до аттестата ===");
