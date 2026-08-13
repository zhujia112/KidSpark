// 模块 3：数字王国
import { speak } from './speech.js';
import { addStars, addCounter } from './store.js';
import { el, toast, celebrate, checkBadges, handleNewBadges, refreshStars } from './util.js';

const CN = ['零','一','二','三','四','五','六','七','八','九','十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];

const OBJ = ['🍎','⭐','🌸','🐱','🍓','🐰','🍇','🐟','🌟','🍊'];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function render(container) {
  container.innerHTML = '';
  container.appendChild(el('div', { class: 'section-title' }, ['🔢', '数字王国']));

  // 模式切换
  let mode = 'know';
  const panel = el('div', {});
  const tabs = el('div', { class: 'btn-row' }, [
    mkTab('know', '🔢 数字认知'),
    mkTab('math', '➕ 加减法'),
    mkTab('count', '🐾 数一数'),
  ]);
  container.appendChild(tabs);
  container.appendChild(panel);

  function mkTab(m, label) {
    return el('button', {
      class: 'btn ghost', style: { flex: '1' },
      onclick: () => { mode = m; draw(); updateTabs(); },
      'data-mode': m,
    }, [label]);
  }
  function updateTabs() {
    tabs.querySelectorAll('[data-mode]').forEach(b => {
      b.classList.toggle('ghost', b.getAttribute('data-mode') !== mode);
      b.classList.toggle('pink', b.getAttribute('data-mode') === mode);
    });
  }
  function draw() {
    panel.innerHTML = '';
    if (mode === 'know') drawKnow(panel);
    else if (mode === 'math') drawMath(panel);
    else drawCount(panel);
  }
  updateTabs();
  draw();
}

// ---- 数字认知 0-20 ----
function drawKnow(panel) {
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'section-sub', text: '点一点数字，听听它怎么读～' }));
  const grid = el('div', { class: 'grid cards' });
  for (let n = 0; n <= 20; n++) {
    const objStr = n === 0 ? '' : OBJ[n % OBJ.length].repeat(Math.min(n, 10));
    const c = el('div', {
      class: 'letter-card',
      style: { background: ['#FFD3E6','#CDEBFF','#FFF0A8','#C7F5D6','#E6D6FF'][n % 5] },
      onclick: () => {
        speak(CN[n], 'zh-CN');
        c.style.transform = 'scale(1.08)';
        setTimeout(() => (c.style.transform = ''), 180);
      },
    }, [
      el('div', { class: 'big', text: String(n) }),
      el('div', { class: 'small', text: CN[n] }),
      objStr ? el('div', { class: 'count-emoji', style: { fontSize: '14px', marginTop: '2px' }, text: objStr }) : null,
    ]);
    grid.appendChild(c);
  }
  card.appendChild(grid);
  panel.appendChild(card);
}

// ---- 加减法 ----
function drawMath(panel) {
  const card = el('div', { class: 'card' });
  const prompt = el('div', { class: 'question-prompt' });
  const row = el('div', { class: 'options-row' });
  card.appendChild(el('div', { class: 'section-sub', text: '10 以内的加减法，选对就加星星！' }));
  card.appendChild(prompt);
  card.appendChild(row);
  panel.appendChild(card);

  function next() {
    row.innerHTML = '';
    const isAdd = Math.random() < 0.55;
    let a, b, ans;
    if (isAdd) { a = rnd(0, 10); b = rnd(0, 10 - a); ans = a + b; }
    else { a = rnd(0, 10); b = rnd(0, a); ans = a - b; }
    prompt.textContent = `${a} ${isAdd ? '+' : '−'} ${b} = ?`;
    speak(`${a} ${isAdd ? '加' : '减'} ${b} 等于几`, 'zh-CN');

    const opts = new Set([ans]);
    while (opts.size < 4) {
      const d = rnd(0, 20);
      if (d !== ans) opts.add(d);
    }
    shuffle([...opts]).forEach(o => {
      const btn = el('div', { class: 'option', onclick: () => {
        if (o === ans) {
          btn.classList.add('correct');
          addStars(1); addCounter('mathRight', 1); refreshStars();
          const newly = checkBadges(); handleNewBadges(newly);
          setTimeout(() => { toast('🎉 答对啦！+1⭐'); next(); }, 900);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      } }, [String(o)]);
      row.appendChild(btn);
    });
  }
  next();
}

// ---- 数一数 ----
function drawCount(panel) {
  const card = el('div', { class: 'card' });
  const emojiBox = el('div', { class: 'count-emoji', style: { fontSize: '38px', margin: '14px 0' } });
  const prompt = el('div', { class: 'question-prompt', text: '数一数有几个？' });
  const row = el('div', { class: 'options-row' });
  card.appendChild(emojiBox);
  card.appendChild(prompt);
  card.appendChild(row);
  panel.appendChild(card);

  function next() {
    row.innerHTML = '';
    const n = rnd(1, 10);
    const obj = OBJ[rnd(0, OBJ.length - 1)];
    emojiBox.textContent = obj.repeat(n);
    speak(`数一数，有几个${obj}`, 'zh-CN');

    const opts = new Set([n]);
    while (opts.size < 4) opts.add(rnd(1, 10));
    shuffle([...opts]).forEach(o => {
      const btn = el('div', { class: 'option', onclick: () => {
        if (o === n) {
          btn.classList.add('correct');
          addStars(1); addCounter('mathRight', 1); refreshStars();
          const newly = checkBadges(); handleNewBadges(newly);
          setTimeout(() => { toast('🎉 数得真棒！+1⭐'); next(); }, 900);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      } }, [String(o)]);
      row.appendChild(btn);
    });
  }
  next();
}

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
