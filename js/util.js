// 通用 UI 工具：创建元素 / Toast / 庆祝彩带 / 徽章检测
import { getState, unlockBadge } from './store.js';
import { BADGES } from './data.js';

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(node.style, v);
    } else if (v !== null && v !== undefined && v !== false) {
      node.setAttribute(k, v);
    }
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

let toastTimer = null;
export function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

const CONFETTI = ['🎉', '⭐', '🌈', '🍬', '💖', '🎊', '🌟', '🍭'];
export function celebrate(count = 26) {
  const layer = document.getElementById('confettiLayer');
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const c = el('span', { class: 'confetti', text: CONFETTI[i % CONFETTI.length] });
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    c.style.fontSize = (20 + Math.random() * 18) + 'px';
    layer.appendChild(c);
    setTimeout(() => c.remove(), 3800);
  }
}

// 根据当前状态解锁满足条件的徽章，返回新解锁的徽章对象数组
export function checkBadges() {
  const s = getState();
  const newly = [];
  const cond = {
    first_star: s.stars >= 1,
    ten_stars:  s.stars >= 10,
    alpha_king: (s.counters.alphabetMatch || 0) >= 5,
    poem_fan:   (s.counters.poemRead || 0) >= 5,
    math_whiz:  (s.counters.mathRight || 0) >= 10,
    logic_king: (s.counters.logicRight || 0) >= 8,
    pass_lv1:   s.adventure.cleared.includes(1),
    pass_lv5:   s.adventure.cleared.includes(5),
    all_clear:  s.adventure.cleared.length >= 8,
  };
  for (const [id, ok] of Object.entries(cond)) {
    if (ok && unlockBadge(id)) {
      const b = BADGES.find(x => x.id === id);
      if (b) newly.push(b);
    }
  }
  return newly;
}

// 处理新解锁的徽章：撒花 + 依次提示
export function handleNewBadges(newly) {
  if (!newly || !newly.length) return;
  celebrate(30);
  newly.forEach((b, i) =>
    setTimeout(() => toast('🎖️ 解锁徽章：' + b.name), i * 700));
}

// 刷新顶部星星显示
export function refreshStars() {
  const s = getState();
  const box = document.getElementById('starBox');
  const cnt = document.getElementById('starCount');
  if (cnt) cnt.textContent = s.stars;
  if (box) {
    box.classList.remove('bump');
    void box.offsetWidth; // 重启动画
    box.classList.add('bump');
  }
}
