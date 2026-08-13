// 模块 1：字母乐园
import { LETTERS, LETTER_COLORS } from './data.js';
import { speak } from './speech.js';
import { addStars, addCounter, getState } from './store.js';
import { el, toast, celebrate, checkBadges, handleNewBadges, refreshStars } from './util.js';

export function render(container) {
  container.innerHTML = '';

  // 标题
  container.appendChild(el('div', { class: 'section-title' }, ['🔤', '字母乐园']));
  container.appendChild(el('div', { class: 'section-sub', text: '点一点字母卡片，听一听它的发音～' }));

  // ---- 字母卡片 ----
  const cardCard = el('div', { class: 'card' });
  cardCard.appendChild(el('div', { class: 'section-title', style: { fontSize: '18px' } }, ['🃏', '字母卡片']));
  const grid = el('div', { class: 'grid cards' });
  LETTERS.forEach((L, i) => {
    const card = el('div', {
      class: 'letter-card',
      style: { background: LETTER_COLORS[i % LETTER_COLORS.length] },
      onclick: () => {
        speak(L, 'en-US');
        card.style.transform = 'scale(1.08)';
        setTimeout(() => (card.style.transform = ''), 180);
      },
    }, [
      el('div', { class: 'big', text: L }),
      el('div', { class: 'small', text: L.toLowerCase() }),
      el('div', { class: 'speak', text: '🔊' }),
    ]);
    grid.appendChild(card);
  });
  cardCard.appendChild(grid);
  container.appendChild(cardCard);

  // ---- 大小写配对游戏 ----
  const gameCard = el('div', { class: 'card' });
  gameCard.appendChild(el('div', { class: 'section-title', style: { fontSize: '18px' } }, ['🎯', '大小写配对游戏']));
  gameCard.appendChild(el('div', { class: 'section-sub', text: '看一看大字母，点出对应的小写字母吧！' }));

  const targetEl = el('div', { class: 'big-number', style: { color: 'var(--pink)' } });
  const optionsRow = el('div', { class: 'options-row' });
  gameCard.appendChild(targetEl);
  gameCard.appendChild(optionsRow);
  container.appendChild(gameCard);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function newQuestion() {
    optionsRow.innerHTML = '';
    const idx = Math.floor(Math.random() * LETTERS.length);
    const L = LETTERS[idx];
    targetEl.textContent = L;
    speak(L, 'en-US');

    const wrong = shuffle(LETTERS.filter((_, i) => i !== idx)).slice(0, 3).map(x => x.toLowerCase());
    const options = shuffle([L.toLowerCase(), ...wrong]);
    const answer = options.indexOf(L.toLowerCase());

    options.forEach((opt, oi) => {
      const btn = el('div', {
        class: 'option', style: { fontSize: '34px' },
        onclick: () => {
          if (oi === answer) {
            btn.classList.add('correct');
            addStars(1);
            addCounter('alphabetMatch', 1);
            refreshStars();
            const newly = checkBadges();
            handleNewBadges(newly);
            setTimeout(() => { toast('🎉 答对啦！+1⭐'); newQuestion(); }, 900);
          } else {
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        },
      }, [opt]);
      optionsRow.appendChild(btn);
    });
  }

  newQuestion();
}
