// Builds ../index.html from ../src/index.src.html and ../data/level*.txt.
// Run with:  node tools/build.js
// It refuses nothing, but prints every problem it finds in the word bank; fix them before publishing.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const POS = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb' };
const src = fs.readFileSync(path.join(root, 'src/index.src.html'), 'utf8');
const homelands = new Function(src.slice(src.indexOf('const HOMELANDS'), src.indexOf('function originOf')) + '; return HOMELANDS;')();
let problems = 0;
const seen = new Map();
const levels = [];
for (let L = 1; L <= 8; L++) {
  const rows = fs.readFileSync(path.join(root, `data/level${L}.txt`), 'utf8').split('\n').filter(x => x.trim());
  const out = [];
  rows.forEach((line, n) => {
    const f = line.split('|');
    const bad = m => { console.log(`level ${L}, line ${n + 1} (${f[0]}): ${m}`); problems++; };
    if (f.length !== (L >= 5 ? 6 : 5)) return bad('expected ' + (L >= 5 ? 6 : 5) + ' fields, found ' + f.length);
    const [w, pos, origin, def, sent, pron] = f;
    if (!/^[a-z]+$/.test(w)) bad('word must be lowercase letters only');
    if (seen.has(w)) bad('duplicate of a word in level ' + seen.get(w));
    seen.set(w, L);
    if (!POS[pos]) bad('unknown part of speech "' + pos + '" (use n, v, adj or adv)');
    for (const lang of origin.split('>')) if (!homelands[lang]) bad('no country listed for "' + lang + '" in HOMELANDS');
    const re = new RegExp('\\b' + w + '\\b', 'i');
    if (!re.test(sent)) bad('the sentence must contain the word exactly');
    if (re.test(def)) bad('the definition gives the word away');
    if (!/[.!?]$/.test(sent) || !/[.]$/.test(def)) bad('definition and sentence need end punctuation');
    if (/["\\]/.test(line)) bad('no double quotes or backslashes');
    if (L >= 5 && !pron) bad('levels 5 to 8 need a pronunciation guide');
    out.push([w, POS[pos], def, sent, pron || '', origin]);
  });
  levels.push(out);
}
const js = 'const WORDS = [\n' + levels.map(lv => '[\n' + lv.map(r => JSON.stringify(r)).join(',\n') + '\n]').join(',\n') + '\n];\n';
const a = src.indexOf('/*WORDS-START*/'), b = src.indexOf('/*WORDS-END*/');
if (a < 0 || b < 0) throw new Error('word bank markers missing from src/index.src.html');
fs.writeFileSync(path.join(root, 'index.html'), src.slice(0, a) + '/*WORDS-START*/\n' + js + src.slice(b));
console.log(`${seen.size} words in ${levels.length} levels (${levels.map(l => l.length).join(', ')}), ${problems} problem(s)`);
process.exitCode = problems ? 1 : 0;
