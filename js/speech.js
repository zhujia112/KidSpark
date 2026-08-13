// 语音朗读：Web Speech API（字母用英文音色，古诗用中文音色）
let supported = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);

// 预加载音色，部分浏览器需要先触发
function warmUp() {
  if (!supported) return;
  try { window.speechSynthesis.getVoices(); } catch (e) {}
}
if (supported) {
  warmUp();
  window.speechSynthesis.onvoiceschanged = warmUp;
}

export function isSupported() { return supported; }

const voiceCache = {};
function pickVoice(lang) {
  if (!supported) return null;
  if (voiceCache[lang]) return voiceCache[lang];
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(x => x.lang && x.lang.toLowerCase().startsWith(lang)) ||
            voices.find(x => x.lang && x.lang.toLowerCase().includes(lang.slice(0, 2)));
  voiceCache[lang] = v || null;
  return v || null;
}

/**
 * 朗读文本
 * @param {string} text
 * @param {'en-US'|'zh-CN'} lang
 */
export function speak(text, lang = 'zh-CN') {
  if (!supported || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = lang === 'en-US' ? 0.85 : 0.9;
    u.pitch = 1.25; // 偏高音，更童趣
    u.volume = 1;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

export function stop() {
  if (supported) { try { window.speechSynthesis.cancel(); } catch (e) {} }
}
