// ============================================================
// 内容数据：字母 / 古诗 / 逻辑题题库 / 徽章
// ============================================================

// ---------- 1. 字母 ----------
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// 字母卡片配色（糖果色循环）
export const LETTER_COLORS = [
  '#FFD3E6', '#CDEBFF', '#FFF0A8', '#C7F5D6', '#E6D6FF',
];

// ---------- 2. 古诗（8 首，带拼音） ----------
export const POEMS = [
  {
    title: '咏鹅', author: '骆宾王', emoji: '🦢',
    lines: [
      { t: '鹅鹅鹅，', p: 'é é é，' },
      { t: '曲项向天歌。', p: 'qū xiàng xiàng tiān gē。' },
      { t: '白毛浮绿水，', p: 'bái máo fú lǜ shuǐ，' },
      { t: '红掌拨清波。', p: 'hóng zhǎng bō qīng bō。' },
    ],
  },
  {
    title: '静夜思', author: '李白', emoji: '🌙',
    lines: [
      { t: '床前明月光，', p: 'chuáng qián míng yuè guāng，' },
      { t: '疑是地上霜。', p: 'yí shì dì shàng shuāng。' },
      { t: '举头望明月，', p: 'jǔ tóu wàng míng yuè，' },
      { t: '低头思故乡。', p: 'dī tóu sī gù xiāng。' },
    ],
  },
  {
    title: '春晓', author: '孟浩然', emoji: '🌸',
    lines: [
      { t: '春眠不觉晓，', p: 'chūn mián bù jué xiǎo，' },
      { t: '处处闻啼鸟。', p: 'chù chù wén tí niǎo。' },
      { t: '夜来风雨声，', p: 'yè lái fēng yǔ shēng，' },
      { t: '花落知多少。', p: 'huā luò zhī duō shǎo。' },
    ],
  },
  {
    title: '悯农', author: '李绅', emoji: '🌾',
    lines: [
      { t: '锄禾日当午，', p: 'chú hé rì dāng wǔ，' },
      { t: '汗滴禾下土。', p: 'hàn dī hé xià tǔ。' },
      { t: '谁知盘中餐，', p: 'shéi zhī pán zhōng cān，' },
      { t: '粒粒皆辛苦。', p: 'lì lì jiē xīn kǔ。' },
    ],
  },
  {
    title: '登鹳雀楼', author: '王之涣', emoji: '🏯',
    lines: [
      { t: '白日依山尽，', p: 'bái rì yī shān jìn，' },
      { t: '黄河入海流。', p: 'huáng hé rù hǎi liú。' },
      { t: '欲穷千里目，', p: 'yù qióng qiān lǐ mù，' },
      { t: '更上一层楼。', p: 'gèng shàng yī céng lóu。' },
    ],
  },
  {
    title: '古朗月行', author: '李白', emoji: '🌝',
    lines: [
      { t: '小时不识月，', p: 'xiǎo shí bù shí yuè，' },
      { t: '呼作白玉盘。', p: 'hū zuò bái yù pán。' },
      { t: '又疑瑶台镜，', p: 'yòu yí yáo tái jìng，' },
      { t: '飞在青云端。', p: 'fēi zài qīng yún duān。' },
    ],
  },
  {
    title: '池上', author: '白居易', emoji: '🪷',
    lines: [
      { t: '小娃撑小艇，', p: 'xiǎo wá chēng xiǎo tǐng，' },
      { t: '偷采白莲回。', p: 'tōu cǎi bái lián huí。' },
      { t: '不解藏踪迹，', p: 'bù jiě cáng zōng jì，' },
      { t: '浮萍一道开。', p: 'fú píng yī dào kāi。' },
    ],
  },
  {
    title: '小池', author: '杨万里', emoji: '🐸',
    lines: [
      { t: '泉眼无声惜细流，', p: 'quán yǎn wú shēng xī xì liú，' },
      { t: '树阴照水爱晴柔。', p: 'shù yīn zhào shuǐ ài qíng róu。' },
      { t: '小荷才露尖尖角，', p: 'xiǎo hé cái lòu jiān jiān jiǎo，' },
      { t: '早有蜻蜓立上头。', p: 'zǎo yǒu qīng tíng lì shàng tóu。' },
    ],
  },
];

// ---------- 3. 逻辑挑战题库 ----------
// type: pattern(找规律) / match(图形配对) / compare(比多少)
export const LOGIC_QUESTIONS = [
  {
    type: 'pattern', prompt: '接下来该是哪个呀？',
    seq: ['🔴', '⭐', '🔴', '⭐', '🔴'],
    options: ['⭐', '🔴', '🟢', '🔵'], answer: 0,
  },
  {
    type: 'pattern', prompt: '小动物的队伍，下一个是谁？',
    seq: ['🐶', '🐱', '🐶', '🐱'],
    options: ['🐶', '🐱', '🐰', '🐻'], answer: 0,
  },
  {
    type: 'pattern', prompt: '图形排队，缺了谁？',
    seq: ['🔺', '🔵', '🔺', '🔵'],
    options: ['🔺', '🔵', '🟣', '⬛'], answer: 0,
  },
  {
    type: 'pattern', prompt: '彩虹规律，下一个是？',
    seq: ['🌟', '🌈', '🌟', '🌈'],
    options: ['🌟', '🌈', '☁️', '⚡'], answer: 0,
  },
  {
    type: 'pattern', prompt: '颜色规律，接下来？',
    seq: ['🟡', '🟢', '🟡', '🟢', '🟡'],
    options: ['🟢', '🟡', '🔴', '🟣'], answer: 0,
  },
  {
    type: 'match', prompt: '找到一模一样的图形！',
    target: '🔴', options: ['🟡', '🔴', '🟢', '🔵'], answer: 1,
  },
  {
    type: 'match', prompt: '和上面一样的在哪里？',
    target: '⭐', options: ['🌟', '⭐', '✨', '💫'], answer: 1,
  },
  {
    type: 'match', prompt: '帮小动物找朋友～',
    target: '🐼', options: ['🐨', '🐼', '🐯', '🐸'], answer: 1,
  },
  {
    type: 'match', prompt: '哪个三角形和它一样？',
    target: '🔺', options: ['🔻', '🔺', '⬛', '🔵'], answer: 1,
  },
  {
    type: 'compare', prompt: '哪边的小动物最多？',
    options: ['🐰🐰', '🐰🐰🐰', '🐰'], answer: 1,
  },
  {
    type: 'compare', prompt: '哪边的星星最少？',
    options: ['⭐⭐⭐⭐', '⭐', '⭐⭐'], answer: 1,
  },
  {
    type: 'compare', prompt: '哪边的爱心最多？',
    options: ['❤️❤️', '❤️', '❤️❤️❤️❤️'], answer: 2,
  },
];

// ---------- 4. 徽章 ----------
export const BADGES = [
  { id: 'first_star',   emoji: '⭐', name: '第一颗星',   desc: '获得第一颗星星' },
  { id: 'ten_stars',    emoji: '🌟', name: '十星小达人', desc: '集齐 10 颗星星' },
  { id: 'alpha_king',   emoji: '🔤', name: '字母小能手', desc: '完成 5 次字母配对' },
  { id: 'poem_fan',     emoji: '📜', name: '古诗小书童', desc: '朗读 5 首古诗' },
  { id: 'math_whiz',    emoji: '➕', name: '算术小天才', desc: '答对 10 道算术题' },
  { id: 'logic_king',   emoji: '🧩', name: '逻辑小侦探', desc: '答对 8 道逻辑题' },
  { id: 'pass_lv1',     emoji: '🏅', name: '冒险新手',   desc: '通过第 1 关' },
  { id: 'pass_lv5',     emoji: '🏆', name: '闯关勇士',   desc: '通过第 5 关' },
  { id: 'all_clear',    emoji: '👑', name: '乐园之王',   desc: '通关全部 8 关' },
];
