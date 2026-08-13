// 模块 5：闯关冒险
import { LETTERS, LOGIC_QUESTIONS, BADGES } from './data.js';
import { speak } from './speech.js';
import { addStars, addCounter, getState, clearLevel, hasBadge } from './store.js';
import { el, toast, celebrate, checkBadges, handleNewBadges, refreshStars } from './util.js';

const TOTAL_LEVELS = 8;
const OBJ = ['🍎','⭐','🌸','🐱','🍓','🐰','🍇','🐟','🌟','🍊'];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// 各类题目生成器，返回统一结构
function genLetter() {
  const i = rnd(0, 25); const L = LETTERS[i];
  const wrong = shuffle(LETTERS.filter((_, k) => k !== i)).slice(0, 3).map(x => x.toLowerCase());
  const options = shuffle([L.toLowerCase(), ...wrong]);
  return { target: L, prompt: '大字母的小写是哪个？', options, answer: options.indexOf(L.toLowerCase()), speak: L, lang: 'en-US' };
}
function genMath(level) {
  const max = Math.min(3 + level, 10);
  const isAdd = Math.random() < 0.6;
  let a, b, ans;
  if (isAdd) { a = rnd(0, max); b = rnd(0, max - a); ans = a + b; }
  else { a = rnd(0, max); b = rnd(0, a); ans = a - b; }
  const opts = new Set([ans]);
  while (opts.size < 4) { const d = rnd(0, Math.max(max, ans) + 5); if (d !== ans) opts.add(d); }
  const options = shuffle([...opts]).map(String);
  return { prompt: `${a} ${isAdd ? '+' : '−'} ${b} = ?`, options, answer: options.indexOf(String(ans)), speak: `${a} ${isAdd ? '加' : '减'} ${b}` };
}
function genCount() {
  const n = rnd(1, 10); const obj = OBJ[rnd(0, OBJ.length - 1)];
  const opts = new Set([n]); while (opts.size < 4) opts.add(rnd(1, 10));
  const options = shuffle([...opts]).map(String);
  return { emoji: obj.repeat(n), prompt: '数一数有几个？', options, answer: options.indexOf(String(n)), speak: `有几个${obj}` };
}
function genPattern() {
  const ps = LOGIC_QUESTIONS.filter(q => q.type === 'pattern');
  const q = ps[rnd(0, ps.length - 1)];
  return { seq: q.seq.join('  '), prompt: q.prompt, options: q.options, answer: q.answer, speak: q.seq.join(' ') };
}
function genMatch() {
  const ms = LOGIC_QUESTIONS.filter(q => q.type === 'match');
  const q = ms[rnd(0, ms.length - 1)];
  return { target: q.target, prompt: q.prompt, options: q.options, answer: q.answer, speak: '找一找一样的' };
}
const GENERATORS = [genLetter, genMath, genCount, genPattern, genMatch];

export function render(container) {
  container.innerHTML = '';
  container.appendChild(el('div', { class: 'section-title' }, ['🚀', '闯关冒险']));

  const state = getState();
  let level = state.adventure.level;
  if (level > TOTAL_LEVELS) level = TOTAL_LEVELS;

  const total = Math.min(4 + level, 12); // 本关题目数
  let idx = 0;
  let stars_gained = 0;

  // 关卡信息
  const infoCard = el('div', { class: 'card' });
  const lvTag = el('span', { class: 'level-tag' });
  const prog = el('div', { class: 'progress' }, [el('span', { style: { width: '0%' } })]);
  infoCard.appendChild(lvTag);
  infoCard.appendChild(prog);
  container.appendChild(infoCard);

  // 题目区
  const card = el('div', { class: 'card' });
  const seqEl = el('div', { class: 'big-number', style: { fontSize: '40px', minHeight: '56px' } });
  const targetEl = el('div', {});
  const emojiEl = el('div', { class: 'count-emoji', style: { fontSize: '36px' } });
  const promptEl = el('div', { class: 'question-prompt' });
  const row = el('div', { class: 'options-row' });
  card.appendChild(seqEl); card.appendChild(targetEl); card.appendChild(emojiEl);
  card.appendChild(promptEl); card.appendChild(row);
  container.appendChild(card);

  const btnRow = el('div', { class: 'btn-row' });
  const skipBtn = el('button', { class: 'btn ghost', onclick: () => nextQ() }, ['🔄 换一题']);
  btnRow.appendChild(skipBtn);
  container.appendChild(btnRow);

  function updateInfo() {
    const cleared = state.adventure.cleared.length;
    lvTag.textContent = `第 ${level} 关 / 共 ${TOTAL_LEVELS} 关 · 已通关 ${cleared}`;
    prog.firstChild.style.width = Math.round((idx / total) * 100) + '%';
  }

  function nextQ() {
    if (idx >= total) { passLevel(); return; }
    seqEl.textContent = ''; targetEl.innerHTML = ''; emojiEl.textContent = ''; row.innerHTML = '';
    const gen = GENERATORS[rnd(0, GENERATORS.length - 1)];
    const q = gen(level);
    if (q.seq) seqEl.textContent = q.seq;
    if (q.target) targetEl.appendChild(el('div', { class: 'big-number', style: { fontSize: '60px', color: 'var(--purple)' }, text: q.target }));
    if (q.emoji) emojiEl.textContent = q.emoji;
    promptEl.textContent = q.prompt;
    if (q.speak) speak(q.speak, q.lang || 'zh-CN');

    const opts = q.options.map((o, oi) => {
      const node = el('div', {
        class: 'option', style: { fontSize: '34px', padding: '10px 16px' },
      }, [o]);
      node.addEventListener('click', () => {
        if (oi === q.answer) {
          opts.forEach(x => x.classList.remove('correct'));
          node.classList.add('correct');
          addStars(1); refreshStars();
          setTimeout(() => { idx++; stars_gained++; updateInfo(); nextQ(); }, 850);
        } else {
          node.classList.add('wrong');
          setTimeout(() => node.classList.remove('wrong'), 500);
        }
      });
      return node;
    });
    opts.forEach(node => row.appendChild(node));
    updateInfo();
  }

  function passLevel() {
    clearLevel(level);
    const bonus = level; // 过关奖励 = 关卡数星星
    addStars(bonus); refreshStars();
    const newly = checkBadges(); handleNewBadges(newly);
    celebrate(40);
    toast(`🏅 第 ${level} 关通过！奖励 ${bonus}⭐`);

    // 通关全部？
    if (state.adventure.cleared.length >= TOTAL_LEVELS) {
      setTimeout(() => { toast('👑 太棒了！全部通关！'); renderBadges(); }, 1200);
      return;
    }
    // 进入下一关
    level = state.adventure.level;
    idx = 0; stars_gained = 0;
    setTimeout(() => { toast(`🚀 进入第 ${level} 关！`); nextQ(); }, 1300);
  }

  // 徽章墙
  function renderBadges() {
    const bCard = el('div', { class: 'card' });
    bCard.appendChild(el('div', { class: 'section-title', style: { fontSize: '20px' } }, ['🎖️', '成就徽章墙']));
    const wall = el('div', { class: 'badge-wall' });
    BADGES.forEach(b => {
      const unlocked = hasBadge(b.id);
      wall.appendChild(el('div', { class: 'badge' + (unlocked ? '' : ' locked') }, [
        el('div', { class: 'b-emoji', text: unlocked ? b.emoji : '🔒' }),
        el('div', { class: 'b-name', text: b.name }),
        el('div', { class: 'b-desc', text: b.desc }),
      ]));
    });
    bCard.appendChild(wall);
    container.appendChild(bCard);
  }

  renderBadges();
  nextQ();
}
