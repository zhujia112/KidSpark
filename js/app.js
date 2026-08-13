// 应用入口：导航 + 首页 + 模块路由
import { getState, resetAll } from './store.js';
import { el, refreshStars, toast } from './util.js';
import * as alphabet from './alphabet.js';
import * as poetry from './poetry.js';
import * as numbers from './numbers.js';
import * as logic from './logic.js';
import * as adventure from './adventure.js';

const MODULES = [
  { id: 'home',      name: '首页',     emoji: '🏠', render: renderHome },
  { id: 'alphabet',  name: '字母乐园', emoji: '🔤', render: alphabet.render },
  { id: 'poetry',    name: '古诗花园', emoji: '🌷', render: poetry.render },
  { id: 'numbers',   name: '数字王国', emoji: '🔢', render: numbers.render },
  { id: 'logic',     name: '逻辑挑战', emoji: '🧩', render: logic.render },
  { id: 'adventure', name: '闯关冒险', emoji: '🚀', render: adventure.render },
];

const LEARNING = MODULES.filter(m => m.id !== 'home');

let current = 'home';

function buildNav() {
  const sidebar = document.getElementById('sidebar');
  const bottomtab = document.getElementById('bottomtab');
  sidebar.innerHTML = '';
  bottomtab.innerHTML = '';

  MODULES.forEach(m => {
    // 侧边栏
    const sBtn = el('button', {
      class: 'nav-item' + (m.id === current ? ' active' : ''),
      'data-id': m.id,
      onclick: () => go(m.id),
    }, [
      el('span', { class: 'nav-emoji', text: m.emoji }),
      el('span', { text: m.name }),
    ]);
    sidebar.appendChild(sBtn);

    // 底部 Tab（全部模块，含首页）
    const bBtn = el('button', {
      class: 'bt-item' + (m.id === current ? ' active' : ''),
      'data-id': m.id,
      onclick: () => go(m.id),
    }, [
      el('span', { class: 'bt-emoji', text: m.emoji }),
      el('span', { text: m.name }),
    ]);
    bottomtab.appendChild(bBtn);
  });
}

function go(id) {
  current = id;
  const mod = MODULES.find(m => m.id === id);
  const content = document.getElementById('content');
  content.scrollTop = 0;
  mod.render(content);
  // 更新高亮
  document.querySelectorAll('[data-id]').forEach(b => {
    const on = b.getAttribute('data-id') === id;
    b.classList.toggle('active', on);
  });
}

function renderHome(container) {
  container.innerHTML = '';
  const s = getState();

  const hero = el('div', { class: 'home-hero' }, [
    el('div', { class: 'hero-emoji', text: '🎠' }),
    el('h1', { text: '宝贝学习乐园' }),
    el('p', { text: `欢迎来玩！你已经收集了 ⭐ ${s.stars} 颗星星` }),
  ]);
  container.appendChild(hero);

  const grid = el('div', { class: 'home-modules' });
  LEARNING.forEach(m => {
    grid.appendChild(el('div', {
      class: 'home-mod',
      onclick: () => go(m.id),
    }, [
      el('div', { class: 'hm-emoji', text: m.emoji }),
      el('div', { class: 'hm-name', text: m.name }),
    ]));
  });
  container.appendChild(grid);

  // 家长小工具
  const tools = el('div', { class: 'card', style: { marginTop: '18px' } }, [
    el('div', { class: 'section-title', style: { fontSize: '18px' } }, ['🛠️', '家长设置']),
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn ghost',
        onclick: () => {
          if (confirm('确定要清空所有星星和闯关进度吗？')) {
            resetAll(); refreshStars(); toast('已重置进度'); go('home');
          }
        },
      }, ['🧹 清空进度']),
    ]),
  ]);
  container.appendChild(tools);
}

// 启动
buildNav();
refreshStars();
go('home');

// 点击 logo 回首页
document.querySelector('.logo').addEventListener('click', () => go('home'));
