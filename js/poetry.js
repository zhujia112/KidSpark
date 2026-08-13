// 模块 2：古诗花园
import { POEMS } from './data.js';
import { speak, isSupported } from './speech.js';
import { addCounter, getState } from './store.js';
import { el, toast, checkBadges, handleNewBadges, refreshStars } from './util.js';

const COLORS = ['#FFD3E6', '#CDEBFF', '#FFF0A8', '#C7F5D6', '#E6D6FF', '#FFE0C2', '#D6F0FF', '#F3D6FF'];

export function render(container) {
  container.innerHTML = '';

  container.appendChild(el('div', { class: 'section-title' }, ['🌷', '古诗花园']));
  container.appendChild(el('div', {
    class: 'section-sub',
    text: isSupported() ? '点诗句听朗读，点标题读整首～' : '点诗句看拼音（当前设备不支持朗读）',
  }));

  POEMS.forEach((poem, pi) => {
    const card = el('div', { class: 'poem', style: { background: COLORS[pi % COLORS.length] } });

    // 标题（点整首朗读）
    const header = el('div', {
      class: 'poem-title',
      onclick: () => {
        speak(poem.lines.map(l => l.t).join(''), 'zh-CN');
        addCounter('poemRead', 1);
        refreshStars();
        const newly = checkBadges();
        handleNewBadges(newly);
        toast('📖 ' + poem.title);
      },
    }, [poem.emoji, poem.title, el('span', { style: { fontSize: '13px', marginLeft: '4px' }, text: '🔊读整首' })]);

    card.appendChild(header);
    card.appendChild(el('div', { class: 'poem-author', text: '—— ' + poem.author }));

    poem.lines.forEach(line => {
      const lineEl = el('div', {
        class: 'poem-line',
        onclick: () => speak(line.t, 'zh-CN'),
      }, [
        el('div', { text: line.t }),
        el('div', { class: 'poem-pinyin', text: line.p }),
      ]);
      card.appendChild(lineEl);
    });

    container.appendChild(card);
  });
}
