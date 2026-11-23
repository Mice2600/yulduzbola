// The presentation: 11 slides, 16:9 (1920x1080 px each). Printed to PDF by tools/pdf.mjs.
import QRCode from 'qrcode';
import fs from 'node:fs';
import { T } from './i18n.mjs';
import { site } from './site.mjs';
import { tasks, badges, ranks, rewards } from './data/app.mjs';

const A = JSON.parse(fs.readFileSync(new URL('./data/app-i18n.json', import.meta.url), 'utf8'));
const B = site.base;
const shortUrl = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export async function deck(lang) {
  const t = T[lang], a = A[lang];
  const pageUrl = site.url + (lang === 'uz' ? '' : lang + '/');
  const qr = await QRCode.toString(pageUrl, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#140b33', light: '#ffffff' } });
  const img = (n) => `${B}img/${n}`;
  const ph = (n, cls = '') => `<div class="phone ${cls}"><div class="phone-body"><div class="phone-screen"><img src="${B}img/app/${n}-${lang}.webp" alt=""></div><i class="island"></i><i class="sb"><b>9:41</b><u></u></i><i class="homebar"></i></div></div>`;
  const strip = (s) => s.replace(/<\/?em>/g, '');
  const em = (s) => s; // titles keep their <em> accent
  const foot = (n) => `<a class="corner" href="${pageUrl}"><span>⭐</span>${shortUrl}</a><span class="num">${String(n).padStart(2, '0')} / 11</span>`;
  const qrCard = (cls = '') => `<a class="qr ${cls}" href="${pageUrl}">${qr}<span><small>${t.d_scan}</small><b>${shortUrl}</b></span></a>`;

  const slides = [
    // 1 cover
    `<section class="slide cover"><img class="bg" src="${img('hero.jpg')}" alt=""><div class="shade-l"></div>
      <div class="cover-in"><p class="brand"><span>⭐</span>YulduzBola</p><p class="kicker">${t.hero_kicker}</p><h1>${em(t.hero_h1)}</h1><p class="lead">${t.hero_sub}</p><p class="chip"><i></i>${t.hero_status}</p></div>
      ${qrCard('br')}${foot(1)}</section>`,
    // 2 problem -> idea
    `<section class="slide split"><div class="half cream"><p class="kicker">01</p><h2>${t.d_problem}</h2>
        <div class="bubbles"><p>${t.d_p1}</p><p>${t.d_p2}</p><p>${t.d_p3}</p></div></div>
      <div class="half night"><img class="bg dim" src="${img('girl.jpg')}" alt=""><div class="shade-b"></div><div class="idea"><h2>${t.d_idea}</h2><p class="lead">${t.d_idea_text}</p></div></div>${foot(2)}</section>`,
    // 3 how it works
    `<section class="slide cream pad"><p class="kicker">${t.how_kicker}</p><h2>${t.how_title}</h2>
      <div class="steps">${[['tasks', 's1'], ['task', 's2'], ['approval', 's3'], ['approved', 's4']].map(([s, k], i) => `<div class="step"><div class="shot s${i + 1}">${ph(s, 'crop')}<b>${i + 1}</b></div><h3>${t[k + '_t']}</h3><p>${t[k + '_d']}</p></div>`).join('')}</div>${foot(3)}</section>`,
    // 4 three looks
    `<section class="slide lilac pad"><div class="row"><div class="col-text"><p class="kicker">${t.age_kicker}</p><h2>${t.d_ages}</h2><p class="lead">${t.age_title}</p>
        <ul class="looks"><li><b>3–6</b>${t.g1.split(': ')[1]}</li><li><b>7–10</b>${t.g2.split(': ')[1]}</li><li><b>11–14</b>${t.g3.split(': ')[1]}</li></ul></div>
      <div class="trio">${ph('taskslittle', 'l')}${ph('tasks', 'c')}${ph('hometeen', 'r')}</div></div>${foot(4)}</section>`,
    // 5 tasks
    `<section class="slide night pad"><p class="kicker">${t.calc_task}</p><h2>${t.d_tasks}</h2>
      <div class="tasks">${tasks.map((x) => `<div class="task" style="--c:${x.color}"><img src="${img('tasks/' + x.id + '.webp')}" alt=""><div><h3>${a[x.key]}</h3><p><b>${'⭐'.repeat(x.stars)}</b></p><p>${x.time} ${t.min} · ${x.min}–${x.max} ${t.yrs}</p></div></div>`).join('')}</div>
      <p class="note">✍️ ${t.d_tasks_note}</p>${foot(5)}</section>`,
    // 6 parents decide
    `<section class="slide cream pad"><div class="row"><div class="col-text wide"><p class="kicker">${t.par_kicker}</p><h2>${em(t.par_title)}</h2><p class="lead">${t.d_par_text}</p>
        <div class="formula"><div style="--c:#3DBE6C"><b>⭐⭐⭐ ${t.q_amazing}</b><strong>+3 ⭐</strong></div><div style="--c:#4D96FF"><b>⭐⭐ ${t.q_good}</b><strong>${t.d_f_good}</strong></div>
          <div style="--c:#E0A800"><b>⭐ ${t.q_needs}</b><strong>−40%</strong></div><div style="--c:#FF6B35"><b>🔄 ${t.q_redo}</b><strong>${t.d_f_redo}</strong></div></div>
        <p class="note dark">➕ ${t.d_f_bonus}</p></div>
      <div class="duo"><figure class="photo"><img src="${img('father.jpg')}" alt=""></figure>${ph('approval', 'over')}</div></div>${foot(6)}</section>`,
    // 7 parent panel
    `<section class="slide lilac pad"><div class="row"><div class="trio small">${ph('pin', 'l')}${ph('parent', 'c')}${ph('rewards', 'r')}</div>
      <div class="col-text"><p class="kicker">${t.par_kicker}</p><h2>${t.d_panel}</h2>
        <div class="feats"><div><span>🔐</span><h3>${t.pf1_t}</h3><p>${t.pf1_d}</p></div><div><span>✍️</span><h3>${t.pf2_t}</h3><p>${t.pf2_d}</p></div><div><span>📊</span><h3>${t.pf3_t}</h3><p>${t.pf3_d}</p></div></div></div></div>${foot(7)}</section>`,
    // 8 badges
    `<section class="slide night pad"><div class="row top"><div class="col-text wide"><p class="kicker">${t.kids_kicker}</p><h2>${t.kids_title}</h2></div>
        <div class="ranks">${ranks.map((r) => `<div><i>${r.icon}</i><b>${a[r.key]}</b><small>${r.at}+ ⭐</small></div>`).join('')}</div></div>
      <div class="badges">${badges.map(([e, k]) => `<div class="badge"><i>${e}</i><b>${a[k]}</b><small>${a[k + 'Desc']}</small></div>`).join('')}</div>
      <div class="three"><p><b>🔥 ${t.k1_t}.</b> ${t.k1_d}</p><p><b>🏆 ${t.k2_t}.</b> ${t.k2_d}</p><p><b>🚀 ${t.k3_t}.</b> ${t.k3_d}</p></div>${foot(8)}</section>`,
    // 9 rewards
    `<section class="slide sunset pad"><div class="row"><div class="col-text wide"><p class="kicker">${t.rew_kicker}</p><h2>${t.rew_title}</h2><p class="lead">${t.d_rew_text}</p>
        <div class="shop">${rewards.map((r) => `<div><i>${r.emoji}</i><b>${t[r.key]}</b><strong>⭐ ${r.cost}</strong></div>`).join('')}</div></div>
      <div class="duo"><figure class="photo"><img src="${img('teen.jpg')}" alt=""></figure>${ph('leaderboard', 'over')}</div></div>${foot(9)}</section>`,
    // 10 honest status
    `<section class="slide cream pad"><p class="kicker">${t.facts_kicker}</p><h2>${t.facts_title}</h2>
      <div class="facts"><div class="ok"><h3><i>✓</i>${t.f_works}</h3><ul><li>${t.fw1}</li><li>${t.fw2}</li><li>${t.fw3}</li><li>${t.fw4}</li></ul></div>
        <div class="test"><h3><i>◐</i>${t.f_test}</h3><ul><li>${t.ft1}</li><li>${t.ft2}</li></ul></div>
        <div class="no"><h3><i>○</i>${t.f_not}</h3><ul><li>${t.fn1}</li><li>${t.fn2}</li><li>${t.fn3}</li></ul></div></div>
      <div class="numbers"><div><b>8</b><span>${t.n1}</span></div><div><b>16</b><span>${t.n2}</span></div><div><b>3</b><span>${t.n3}</span></div><div><b>3–14</b><span>${t.n4}</span></div><div><b>0</b><span>${t.n5}</span></div></div>${foot(10)}</section>`,
    // 11 closing
    `<section class="slide closing"><img class="bg" src="${img('night.jpg')}" alt=""><div class="shade-t"></div>
      <div class="closing-in"><p class="brand"><span>⭐</span>YulduzBola</p><h1>${t.fin_title}</h1><p class="lead">${t.fin_text}</p>
        <div class="closing-cta">${qrCard('big')}<div><p class="kicker">${t.d_try}</p><a class="url" href="${pageUrl}">${shortUrl}</a><p class="chip"><i></i>${t.d_privacy}</p></div></div></div>${foot(11)}</section>`,
  ];

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${strip(t.title)}</title>
<meta name="robots" content="noindex"><meta name="viewport" content="width=1920">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito:wght@500;700;800&family=Rubik:wght@600;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${B}deck.css"></head><body>${slides.join('\n')}</body></html>`;
}
