// The one-page site. page(lang) returns the full HTML for one language.
import { T, langs, langNames } from './i18n.mjs';
import { site } from './site.mjs';
import { tasks, badges, ranks, rewards } from './data/app.mjs';
import fs from 'node:fs';

const A = JSON.parse(fs.readFileSync(new URL('./data/app-i18n.json', import.meta.url), 'utf8'));
const B = site.base;
export const langUrl = (l) => (l === 'uz' ? B : `${B}${l}/`);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const phoneExtras = '<i class="island"></i><i class="sb"><b>9:41</b><u></u></i><i class="homebar"></i>';
const phone = (name, lang, cls = '', alt = '') =>
  `<div class="phone ${cls}"><div class="phone-body"><div class="phone-screen"><img src="${B}img/app/${name}-${lang}.webp" alt="${esc(alt)}" loading="lazy" width="780" height="1824"></div>${phoneExtras}</div></div>`;

export function page(lang) {
  const t = T[lang], a = A[lang];
  const c = site.contact, hasContact = c.email || c.phone || c.telegram;
  const client = {
    lang, base: B,
    t: Object.fromEntries(['sweep_done', 'sweep_hint', 'sweep_progress', 'age_avail', 'rew_need', 'rew_buy', 'rew_bought', 'fin_collected', 'calc_redo', 'g1', 'g2', 'g3'].map((k) => [k, t[k]])),
    tasks: tasks.map((x) => ({ ...x, name: a[x.key] })),
    ranks: ranks.map((r) => r.at),
  };
  const steps = [['tasks', 's1'], ['task', 's2'], ['approval', 's3'], ['approved', 's4']];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${site.url}${lang === 'uz' ? '' : lang + '/'}">
${langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${site.url}${l === 'uz' ? '' : l + '/'}">`).join('\n')}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${site.url}img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#160D3A">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⭐</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito:wght@500;700;800&family=Rubik:wght@600;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${B}style.css">
</head>
<body>
<header class="nav" id="nav">
  <a class="logo" href="#top"><span class="logo-star">⭐</span>YulduzBola</a>
  <nav class="nav-links">
    <a href="#demo">${t.nav_demo}</a><a href="#parents">${t.nav_parents}</a><a href="#kids">${t.nav_kids}</a><a href="#facts">${t.nav_facts}</a><a href="#downloads">${t.nav_pdf}</a>
  </nav>
  <div class="nav-right">
    <div class="wallet" id="wallet" title="${esc(t.your_stars)}" aria-label="${esc(t.your_stars)}"><span class="wallet-star">⭐</span><b id="walletN">0</b></div>
    <div class="langs">${langs.map((l) => `<a href="${langUrl(l)}" ${l === lang ? 'class="on" aria-current="true"' : ''} lang="${l}" title="${langNames[l]}">${l.toUpperCase()}</a>`).join('')}</div>
  </div>
</header>

<main id="top">
<section class="hero">
  <picture class="hero-bg"><source media="(max-width: 760px)" srcset="${B}img/hero-m.jpg"><img src="${B}img/hero.jpg" alt="" fetchpriority="high"></picture>
  <div class="hero-shade"></div>
  <div class="hero-stars" id="heroStars" aria-hidden="true"></div>
  <div class="hero-in">
    <p class="kicker">${t.hero_kicker}</p>
    <h1>${t.hero_h1}</h1>
    <p class="lead">${t.hero_sub}</p>
    <div class="cta-row">
      <a class="btn btn-gold" href="#demo">▶ ${t.cta_try}</a>
      <a class="btn btn-ghost" href="${B}downloads/yulduzbola-${lang}.pdf" download>${t.cta_pdf}</a>
    </div>
    <p class="status-chip"><i></i>${t.hero_status}</p>
  </div>
  <p class="hand hero-hint">${t.hero_hint} <span>↗</span></p>
</section>

<section class="sweep night" id="sweep">
  <div class="wrap two">
    <div>
      <p class="kicker">${t.sweep_kicker}</p>
      <h2>${t.sweep_title}</h2>
      <p class="lead">${t.sweep_text}</p>
      <div class="sweep-meter"><span>${t.sweep_progress}</span><div class="bar"><i id="sweepBar"></i></div><b id="sweepPct">0%</b></div>
      <button class="btn btn-ghost sm" id="sweepAgain" hidden>↻ ${t.sweep_again}</button>
    </div>
    <div class="sweep-card" id="sweepCard">
      <img src="${B}img/night.jpg" alt="" loading="lazy">
      <canvas id="sweepCanvas"></canvas>
      <div class="broom" id="broom" aria-hidden="true">🧹</div>
      <div class="sweep-done" id="sweepDone" hidden>${t.sweep_done}</div>
    </div>
  </div>
</section>

<section class="how cream" id="how">
  <div class="wrap">
    <p class="kicker">${t.how_kicker}</p>
    <h2>${t.how_title}</h2>
    <ol class="steps">
      ${steps.map(([img, k], i) => `<li class="step reveal">
        <div class="step-shot">${phone(img, lang, 'crop', t[k + '_t'])}<span class="step-n">${i + 1}</span></div>
        <h3>${t[k + '_t']}</h3><p>${t[k + '_d']}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="demo night" id="demo">
  <div class="wrap two">
    <div class="demo-copy">
      <p class="kicker">${t.demo_kicker}</p>
      <h2>${t.demo_title}</h2>
      <p class="lead">${t.demo_text}</p>
      <ul class="tips">
        <li><span>🧒</span><p>${t.demo_tip1}</p></li>
        <li><span>🔑</span><p>${t.demo_tip2.replace('{x}', a.parentAccess)}</p></li>
        <li><span>⭐</span><p>${t.demo_tip3}</p></li>
      </ul>
      <div class="cta-row">
        <button class="btn btn-ghost sm" id="demoReset">↻ ${t.demo_reset}</button>
        <a class="btn btn-ghost sm" href="${B}demo/?as=aziz&lang=${lang}#/home" target="_blank" rel="noopener">↗ ${t.demo_open}</a>
      </div>
      <p class="fine">${t.demo_note}</p>
    </div>
    <div class="demo-stage">
      <div class="phone live" id="demoPhone"><div class="phone-body">
        <div class="phone-screen">
          <img src="${B}img/app/home-${lang}.webp" alt="" loading="lazy">
          <button class="demo-play" id="demoPlay"><span>▶</span>${t.demo_play}</button>
        </div>${phoneExtras}
      </div></div>
    </div>
  </div>
</section>

<section class="parents cream" id="parents">
  <div class="wrap">
    <div class="two">
      <div>
        <p class="kicker">${t.par_kicker}</p>
        <h2>${t.par_title}</h2>
        <p class="lead">${t.par_text}</p>
      </div>
      <figure class="photo tilt-r"><img src="${B}img/father.jpg" alt="" loading="lazy"></figure>
    </div>
    <div class="calc reveal" id="calc">
      <div class="calc-controls">
        <h3>${t.calc_task}</h3>
        <div class="chips" id="calcTasks">${tasks.map((x, i) => `<button data-i="${i}" class="chip${i === 0 ? ' on' : ''}" style="--c:${x.color}">${x.emoji} ${a[x.key]} <b>${x.stars}⭐</b></button>`).join('')}</div>
        <h3>${t.calc_quality}</h3>
        <div class="quals" id="calcQ">
          <button data-q="amazing" style="--c:#3DBE6C">⭐⭐⭐ ${t.q_amazing}</button>
          <button data-q="good" class="on" style="--c:#4D96FF">⭐⭐ ${t.q_good}</button>
          <button data-q="needs" style="--c:#E0A800">⭐ ${t.q_needs}</button>
          <button data-q="redo" style="--c:#FF6B35">🔄 ${t.q_redo}</button>
        </div>
        <h3>${t.calc_bonus}</h3>
        <div class="chips" id="calcB">
          <button data-b="2" class="chip" style="--c:#E0A800">+2 ⭐ ${t.b2}</button>
          <button data-b="3" class="chip" style="--c:#E0A800">+3 ⭐ ${t.b3}</button>
          <button data-b="5" class="chip" style="--c:#E0A800">+5 ⭐ ${t.b5}</button>
        </div>
      </div>
      <div class="calc-result" id="calcResult">
        <div class="calc-lines">
          <p><span>${t.calc_base}</span><b id="cBase">+3 ⭐</b></p>
          <p id="cQualRow"><span>${t.calc_qual}</span><b id="cQual">0</b></p>
          <p id="cBonRow"><span>${t.calc_bon}</span><b id="cBon">0</b></p>
        </div>
        <div class="calc-total"><span>${t.calc_total}</span><strong id="cTotal">⭐ 3</strong><em id="cXp" data-l="${t.calc_xp}">+30 ${t.calc_xp}</em></div>
        <p class="calc-redo" id="cRedo" hidden>${t.calc_redo}</p>
      </div>
    </div>
    <div class="feat3">
      <div class="feat reveal"><span>🔐</span><h3>${t.pf1_t}</h3><p>${t.pf1_d}</p></div>
      <div class="feat reveal"><span>✍️</span><h3>${t.pf2_t}</h3><p>${t.pf2_d}</p></div>
      <div class="feat reveal"><span>📊</span><h3>${t.pf3_t}</h3><p>${t.pf3_d}</p></div>
    </div>
    <div class="panel-shots">
      ${phone('pin', lang, 'sm tl', '')}${phone('parent', lang, 'sm', t.d_panel)}${phone('approval', lang, 'sm tr', '')}
    </div>
  </div>
</section>

<section class="ages lilac" id="ages">
  <div class="wrap">
    <p class="kicker">${t.age_kicker}</p>
    <h2>${t.age_title}</h2>
    <p class="lead">${t.age_text}</p>
    <div class="age-ui">
      <div class="age-left">
        <label class="age-slider"><span>${t.age_label}</span><output id="ageOut">8</output>
          <input type="range" id="age" min="3" max="14" value="8" aria-label="${esc(t.age_label)}"></label>
        <p class="age-avail" id="ageAvail"></p>
        <div class="age-tasks" id="ageTasks">${tasks.map((x) => `<div class="atask" data-min="${x.min}" data-max="${x.max}" style="--c:${x.color}">
          <img src="${B}img/tasks/${x.id}.webp" alt="" loading="lazy"><div><b>${a[x.key]}</b><small>${x.stars}⭐ · ${x.time} ${t.min} · ${x.min}–${x.max} ${t.yrs}</small></div><i>🔒</i></div>`).join('')}</div>
      </div>
      <div class="age-right">
        <div class="age-phones" id="agePhones" data-g="2">
          ${phone('taskslittle', lang, 'g g1', t.g1)}${phone('tasks', lang, 'g g2', t.g2)}${phone('hometeen', lang, 'g g3', t.g3)}
        </div>
        <p class="hand age-cap" id="ageCap">${t.g2}</p>
      </div>
    </div>
  </div>
</section>

<section class="kids night" id="kids">
  <div class="wrap">
    <div class="two top">
      <div>
        <p class="kicker">${t.kids_kicker}</p>
        <h2>${t.kids_title}</h2>
        <p class="lead">${t.kids_text}</p>
      </div>
      <figure class="photo tilt-l small"><img src="${B}img/girl.jpg" alt="" loading="lazy"></figure>
    </div>
    <div class="badges" id="badges">${badges.map(([e, k]) => `<button class="badge"><span class="b-front"><i>${e}</i></span><span class="b-back"><b>${a[k]}</b><small>${a[k + 'Desc']}</small></span></button>`).join('')}</div>
    <h3 class="ranks-title">${t.ranks_title}</h3>
    <div class="ranks" id="ranks">${ranks.map((r) => `<div class="rank" data-at="${r.at}"><i>${r.icon}</i><b>${a[r.key]}</b><small>${r.at}+ ⭐</small></div>`).join('<span class="rank-line"></span>')}</div>
    <div class="feat3 dark">
      <div class="feat reveal"><span>🔥</span><h3>${t.k1_t}</h3><p>${t.k1_d}</p></div>
      <div class="feat reveal"><span>🏆</span><h3>${t.k2_t}</h3><p>${t.k2_d}</p></div>
      <div class="feat reveal"><span>🚀</span><h3>${t.k3_t}</h3><p>${t.k3_d}</p></div>
    </div>
  </div>
</section>

<section class="rewards sunset" id="rewards">
  <div class="wrap two">
    <div>
      <p class="kicker">${t.rew_kicker}</p>
      <h2>${t.rew_title}</h2>
      <p class="lead">${t.rew_text}</p>
      <div class="shop" id="shop">${rewards.map((r) => `<div class="reward" data-cost="${r.cost}"><i>${r.emoji}</i><b>${t[r.key]}</b><strong>⭐ ${r.cost}</strong><button></button></div>`).join('')}</div>
      <p class="fine light">${t.rew_hint}</p>
    </div>
    <div class="rew-photo">
      <figure class="photo tilt-r"><img src="${B}img/teen.jpg" alt="" loading="lazy"></figure>
      ${phone('rewards', lang, 'sm over', '')}
    </div>
  </div>
</section>

<section class="facts cream" id="facts">
  <div class="wrap">
    <p class="kicker">${t.facts_kicker}</p>
    <h2>${t.facts_title}</h2>
    <p class="lead">${t.facts_text}</p>
    <div class="fact-cols">
      <div class="fact ok reveal"><h3><i>✓</i>${t.f_works}</h3><ul><li>${t.fw1}</li><li>${t.fw2}</li><li>${t.fw3}</li><li>${t.fw4}</li></ul></div>
      <div class="fact test reveal"><h3><i>◐</i>${t.f_test}</h3><ul><li>${t.ft1}</li><li>${t.ft2}</li></ul></div>
      <div class="fact no reveal"><h3><i>○</i>${t.f_not}</h3><ul><li>${t.fn1}</li><li>${t.fn2}</li><li>${t.fn3}</li></ul></div>
    </div>
    <div class="numbers">
      <div><b>8</b><span>${t.n1}</span></div><div><b>16</b><span>${t.n2}</span></div><div><b>3</b><span>${t.n3}</span></div><div><b>3–14</b><span>${t.n4}</span></div><div><b>0</b><span>${t.n5}</span></div>
    </div>
  </div>
</section>

<section class="downloads night" id="downloads">
  <div class="wrap two">
    <div>
      <p class="kicker">${t.dl_kicker}</p>
      <h2>${t.dl_title}</h2>
      <p class="lead">${t.dl_text}</p>
      <div class="dl-list">
        ${[lang, ...langs.filter((l) => l !== lang)].map((l) => `<div class="dl${l === lang ? ' main' : ''}"><b>${langNames[l]}</b>
          <a class="btn ${l === lang ? 'btn-gold' : 'btn-ghost'} sm" href="${B}downloads/yulduzbola-${l}.pdf" download>⬇ ${t.dl_full}</a>
          <a class="btn btn-ghost sm" href="${B}downloads/yulduzbola-${l}-light.pdf" download>⬇ ${t.dl_light}</a></div>`).join('\n        ')}
      </div>
      ${site.apkUrl ? `<a class="btn btn-gold" href="${site.apkUrl}">🤖 ${t.dl_apk}</a>` : ''}
    </div>
    <a class="deck-thumb" href="${B}downloads/yulduzbola-${lang}.pdf" target="_blank" rel="noopener"><img src="${B}img/deck-${lang}.jpg" alt="${esc(t.dl_title)}" loading="lazy"></a>
  </div>
</section>

<section class="final" id="final">
  <img class="final-bg" src="${B}img/night.jpg" alt="" loading="lazy">
  <div class="final-shade"></div>
  <div class="final-in">
    <h2>${t.fin_title}</h2>
    <p class="lead">${t.fin_text}</p>
    <p class="hand fin-count" id="finCount"></p>
    <a class="btn btn-gold" href="#demo">▶ ${t.cta_try}</a>
    ${hasContact ? `<div class="contact"><h3>${t.contact}</h3>
      ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}${c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.phone)}</a>` : ''}${c.telegram ? `<a href="https://t.me/${esc(c.telegram.replace(/^@/, ''))}">Telegram: @${esc(c.telegram.replace(/^@/, ''))}</a>` : ''}</div>` : ''}
  </div>
</section>
</main>

<footer class="foot"><span>⭐ YulduzBola · ${new Date().getFullYear()}</span><span>${t.foot_ai}</span></footer>
<div class="toast" id="toast" hidden></div>
<script>window.YB=${JSON.stringify(client)};</script>
<script src="${B}app.js" defer></script>
</body>
</html>`;
}
