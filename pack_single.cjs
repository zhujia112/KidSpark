// 打包：将多文件 ES Module 版合并为「双击即用」的单文件 HTML（去掉 import/export，普通 script 即可在 file:// 下运行）
const fs = require('fs');
const path = require('path');

const dir = 'D:/zhujia/MyWBuddy/宝贝学习乐园';
const css = fs.readFileSync(path.join(dir, 'css/style.css'), 'utf8');

const order = ['store', 'speech', 'data', 'util', 'alphabet', 'poetry', 'numbers', 'logic', 'adventure', 'app'];
const renderMods = ['alphabet', 'poetry', 'numbers', 'logic', 'adventure'];

let code = '';
for (const f of order) {
  let s = fs.readFileSync(path.join(dir, 'js', f + '.js'), 'utf8');
  // 1) 删除所有 import 行（覆盖 import * as / import { } / import x from）
  s = s.replace(/^[ \t]*import\b.*$/gm, '');
  // 2) 去掉 export 关键字（export function/const/let/var -> 全局）
  s = s.replace(/\bexport\s+/g, '');
  // 3) 各学习模块的 render 重名 -> render_<mod>
  if (renderMods.includes(f)) {
    s = s.replace(/\bfunction render\b/g, 'function render_' + f);
  }
  // 4) 解决 numbers 与 adventure 顶层 const OBJ 冲突
  if (f === 'numbers') s = s.replace(/\bOBJ\b/g, 'NUM_OBJ');
  if (f === 'adventure') s = s.replace(/\bOBJ\b/g, 'ADV_OBJ');
  code += '\n/* ===== ' + f + '.js ===== */\n' + s + '\n';
}

// 5) app.js 中 <mod>.render 调用 -> render_<mod>（其余依赖经去 import 后已是全局，无需改）
for (const m of renderMods) {
  code = code.replace(new RegExp('\\b' + m + '\\.render\\b', 'g'), 'render_' + m);
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#FF9EC4" />
  <title>宝贝学习乐园</title>
  <style>
${css}
  </style>
</head>
<body>
  <div id="app">
    <header class="topbar">
      <div class="logo">
        <span class="logo-emoji">🎠</span>
        <span class="logo-text">宝贝学习乐园</span>
      </div>
      <div class="star-box" id="starBox" title="我的星星">
        <span class="star-icon">⭐</span>
        <span class="star-count" id="starCount">0</span>
      </div>
    </header>
    <div class="layout">
      <nav class="sidebar" id="sidebar"></nav>
      <main class="content" id="content"></main>
    </div>
    <nav class="bottomtab" id="bottomtab"></nav>
  </div>
  <div class="confetti-layer" id="confettiLayer"></div>
  <div class="toast" id="toast"></div>

  <script>
${code}
  </script>
</body>
</html>
`;

const out = path.join(dir, '宝贝学习乐园-单文件版.html');
fs.writeFileSync(out, html, 'utf8');
console.log('written:', out, 'bytes:', html.length);
