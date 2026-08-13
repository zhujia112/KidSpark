// 模块 4：逻辑挑战
import { LOGIC_QUESTIONS } from './data.js';
import { speak } from './speech.js';
import { addStars, addCounter } from './store.js';
import { el, toast, celebrate, checkBadges, handleNewBadges, refreshStars } from './util.js';

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
  container.appendChild(el('div', { class: 'section-title' }, ['🧩', '逻辑挑战']));
  container.appendChild(el('div', { class: 'section-sub', text: '找规律 / 图形配对 / 比多少，选对就加星星！' }));

  const card = el('div', { class: 'card' });
  const seqEl = el('div', { class: 'big-number', style: { fontSize: '40px', minHeight: '60px' } });
  const targetEl = el('div', {});
  const promptEl = el('div', { class: 'question-prompt' });
  const row = el('div', { class: 'options-row' });
  card.appendChild(seqEl);
  card.appendChild(targetEl);
  card.appendChild(promptEl);
  card.appendChild(row);
  container.appendChild(card);

  function next() {
    seqEl.textContent = '';
    targetEl.innerHTML = '';
    row.innerHTML = '';
    const q = LOGIC_QUESTIONS[Math.floor(Math.random() * LOGIC_QUESTIONS.length)];

    if (q.type === 'pattern') {
      seqEl.textContent = q.seq.join('  ');
      speak(q.seq.join(' '), 'zh-CN');
    } else if (q.type === 'match') {
      targetEl.appendChild(el('div', {
        class: 'big-number', style: { fontSize: '64px', color: 'var(--purple)' },
        text: q.target,
      }));
      speak('找一找，一样的在哪里', 'zh-CN');
    } else if (q.type === 'compare') {
      seqEl.textContent = '';
    }

    promptEl.textContent = q.prompt;

    const opts = q.options.map((o, oi) => {
      const node = el('div', {
        class: 'option', style: { fontSize: q.type === 'compare' ? '26px' : '34px', padding: '10px 14px' },
      }, [o]);
      node.addEventListener('click', () => {
        if (oi === q.answer) {
          opts.forEach(x => x.classList.remove('correct'));
          node.classList.add('correct');
          addStars(1); addCounter('logicRight', 1); refreshStars();
          const newly = checkBadges(); handleNewBadges(newly);
          setTimeout(() => { toast('🎉 答对啦！+1⭐'); next(); }, 950);
        } else {
          node.classList.add('wrong');
          setTimeout(() => node.classList.remove('wrong'), 500);
        }
      });
      return node;
    });
    opts.forEach(node => row.appendChild(node));
  }

  next();
}
