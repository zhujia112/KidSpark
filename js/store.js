// 本地存储：闯关进度 / 星星 / 徽章 持久化
const KEY = 'baobei_xuexi_leiyuan_v1';

// 安全克隆（避免旧浏览器无 structuredClone）
const clone = (o) => JSON.parse(JSON.stringify(o));

const DEFAULT = {
  stars: 0,
  badges: [],                         // 已解锁徽章 id
  adventure: { level: 1, cleared: [] },// 闯关：当前关 / 已通关关卡
  counters: {                         // 各类行为计数（用于解锁徽章）
    alphabetMatch: 0,
    poemRead: 0,
    mathRight: 0,
    logicRight: 0,
  },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return clone(DEFAULT);
    const parsed = JSON.parse(raw);
    // 合并默认，避免旧数据缺字段
    return {
      ...clone(DEFAULT),
      ...parsed,
      counters: { ...DEFAULT.counters, ...(parsed.counters || {}) },
      adventure: { ...DEFAULT.adventure, ...(parsed.adventure || {}) },
    };
  } catch (e) {
    return clone(DEFAULT);
  }
}

let state = load();

export function getState() { return state; }

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

export function addStars(n) {
  state.stars += n;
  save();
  return state.stars;
}

export function addCounter(key, n = 1) {
  state.counters[key] = (state.counters[key] || 0) + n;
  save();
  return state.counters[key];
}

export function unlockBadge(id) {
  if (!state.badges.includes(id)) {
    state.badges.push(id);
    save();
    return true; // 首次解锁
  }
  return false;
}

export function hasBadge(id) { return state.badges.includes(id); }

export function clearLevel(level) {
  if (!state.adventure.cleared.includes(level)) {
    state.adventure.cleared.push(level);
  }
  // 自动推进到下一关
  state.adventure.level = Math.max(state.adventure.level, level + 1);
  save();
}

export function resetAll() {
  state = clone(DEFAULT);
  save();
}
