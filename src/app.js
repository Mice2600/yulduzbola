// YulduzBola site: the page itself is a small game. Stars you collect are kept in the wallet (top right).
(function () {
  var YB = window.YB, $ = function (id) { return document.getElementById(id); };
  var KEY = 'yb_site_v1';
  var S = { stars: 0, badges: [], swept: false, bought: [] };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) for (var k in saved) S[k] = saved[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- wallet ----------
  var wallet = $('wallet'), walletN = $('walletN');
  function renderWallet() {
    walletN.textContent = S.stars;
    var fc = $('finCount'); if (fc) fc.textContent = S.stars > 0 ? YB.t.fin_collected.replace('{n}', S.stars) : '';
    renderShop(); renderRanks();
  }
  function addStars(n, from) {
    S.stars += n; save();
    if (from && !reduce) flyStar(from, n);
    wallet.classList.remove('bump'); void wallet.offsetWidth; wallet.classList.add('bump');
    renderWallet();
  }
  function flyStar(from, n) {
    var r = from.getBoundingClientRect ? from.getBoundingClientRect() : from, w = wallet.getBoundingClientRect();
    for (var i = 0; i < Math.min(n, 5); i++) (function (i) {
      var el = document.createElement('div'); el.className = 'fly'; el.textContent = '⭐';
      el.style.left = r.left + r.width / 2 - 15 + 'px'; el.style.top = r.top + r.height / 2 - 15 + 'px';
      document.body.appendChild(el);
      setTimeout(function () {
        el.style.transform = 'translate(' + (w.left + w.width / 2 - r.left - r.width / 2) + 'px,' + (w.top - r.top - r.height / 2 + 10) + 'px) scale(.5)';
        el.style.opacity = '.2';
      }, 30 + i * 90);
      setTimeout(function () { el.remove(); }, 1000 + i * 90);
    })(i);
  }
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toast.h); toast.h = setTimeout(function () { t.hidden = true; }, 3800);
  }
  function confetti() {
    if (reduce) return;
    var colors = ['#FF6B35', '#FFD93D', '#6BCB77', '#845EC2', '#4D96FF', '#FF9EBC', '#4ECDC4'];
    for (var i = 0; i < 70; i++) {
      var c = document.createElement('i'); c.className = 'confetti';
      var s = 7 + Math.random() * 9;
      c.style.cssText = 'left:' + Math.random() * 100 + 'vw;width:' + s + 'px;height:' + s + 'px;background:' + colors[i % colors.length] + ';border-radius:' + (i % 3 ? '2px' : '50%') + ';animation-duration:' + (2.2 + Math.random() * 1.6) + 's;animation-delay:' + Math.random() * .6 + 's';
      document.body.appendChild(c); setTimeout(function (c) { c.remove(); }, 4600, c);
    }
  }

  // ---------- hero: flying stars ----------
  var heroStars = $('heroStars'), heroVisible = true;
  function spawnStar() {
    if (!heroVisible || document.hidden || heroStars.childElementCount > 7) return;
    var b = document.createElement('button'); b.className = 'fstar'; b.textContent = '⭐'; b.tabIndex = -1;
    var mobile = innerWidth < 760;
    b.style.left = (mobile ? 8 + Math.random() * 78 : 42 + Math.random() * 52) + '%';
    b.style.setProperty('--s', 26 + Math.random() * 26 + 'px');
    b.style.setProperty('--d', 8 + Math.random() * 6 + 's');
    b.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); if (b.classList.contains('got')) return; b.classList.add('got'); addStars(1, b); setTimeout(function () { b.remove(); }, 500); });
    b.addEventListener('animationend', function (e) { if (e.animationName === 'rise') b.remove(); });
    heroStars.appendChild(b);
  }
  if (!reduce) { setInterval(spawnStar, 1500); setTimeout(spawnStar, 600); setTimeout(spawnStar, 1100); }
  new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(heroStars);

  // ---------- sweep game ----------
  (function () {
    var card = $('sweepCard'), cv = $('sweepCanvas'), broom = $('broom'), ctx = cv.getContext('2d', { willReadFrequently: true });
    var done = false, drawing = false, last = null, W, H;
    function dust() {
      var r = card.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = cv.width = Math.round(r.width * d); H = cv.height = Math.round(r.height * d);
      var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#8d8577'); g.addColorStop(.5, '#a59a86'); g.addColorStop(1, '#7b7468');
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < 2600; i++) { // specks, fluff and scribbles
        ctx.fillStyle = 'rgba(' + (Math.random() < .5 ? '60,52,44' : '214,204,186') + ',' + (.08 + Math.random() * .25) + ')';
        var s = Math.random() * 5 * d; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, s, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(60,52,44,.25)'; ctx.lineWidth = 1.5 * d;
      for (var j = 0; j < 40; j++) { var x = Math.random() * W, y = Math.random() * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 30 * d, y - 20 * d, x - 20 * d, y + 30 * d, x + 40 * d * Math.random(), y + 10 * d); ctx.stroke(); }
      ctx.save(); ctx.translate(W / 2, H * .3); ctx.rotate(-.06); ctx.textAlign = 'center';
      ctx.font = '700 ' + Math.round(W * .085) + 'px Caveat, cursive'; ctx.fillStyle = 'rgba(255,255,255,.82)';
      ctx.fillText(YB.t.sweep_hint, 0, 0); ctx.restore();
      cv.style.opacity = 1; done = false; $('sweepDone').hidden = true; $('sweepAgain').hidden = true; setPct(0); broom.style.opacity = 1;
    }
    function setPct(p) { $('sweepBar').style.width = p + '%'; $('sweepPct').textContent = p + '%'; }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H, cx: e.clientX - r.left, cy: e.clientY - r.top }; }
    function wipe(p) {
      ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = '#000'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = W * .13;
      ctx.beginPath(); ctx.moveTo((last || p).x, (last || p).y); ctx.lineTo(p.x + .1, p.y + .1); ctx.stroke(); last = p;
    }
    var tick = 0;
    function measure() {
      var d = ctx.getImageData(0, 0, W, H).data, clear = 0, n = 0;
      for (var i = 3; i < d.length; i += 4 * 97) { n++; if (d[i] < 40) clear++; }
      var p = Math.round(clear / n * 100); setPct(Math.min(100, Math.round(p / .62)));
      if (p >= 62 && !done) finish();
    }
    function finish() {
      done = true; cv.style.opacity = 0; broom.style.opacity = 0; setPct(100);
      $('sweepDone').hidden = false; $('sweepAgain').hidden = false; confetti();
      if (!S.swept) { S.swept = true; addStars(3, card); }
    }
    card.addEventListener('pointerdown', function (e) { if (done) return; drawing = true; last = null; card.setPointerCapture(e.pointerId); broom.classList.add('drag'); move(e); });
    function move(e) {
      var p = pos(e); broom.style.left = p.cx + 'px'; broom.style.top = p.cy + 'px';
      if (!drawing || done) return; wipe(p); if (++tick % 12 === 0) measure();
    }
    card.addEventListener('pointermove', move);
    function up() { if (drawing) { drawing = false; last = null; if (!done) measure(); } }
    card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up);
    $('sweepAgain').addEventListener('click', dust);
    var ready = false;
    new IntersectionObserver(function (en, o) { if (en[0].isIntersecting && !ready) { ready = true; dust(); o.disconnect(); } }, { rootMargin: '300px' }).observe(card);
    var rw; addEventListener('resize', function () { clearTimeout(rw); rw = setTimeout(function () { if (ready && !done && !drawing) dust(); }, 300); });
  })();

  // ---------- live demo ----------
  (function () {
    var play = $('demoPlay'), screen = play.parentNode, frame;
    function start(reset) {
      if (!frame) { frame = document.createElement('iframe'); frame.title = 'YulduzBola'; frame.allow = 'camera'; screen.innerHTML = ''; screen.appendChild(frame); }
      frame.src = YB.base + 'demo/?as=aziz&lang=' + YB.lang + (reset ? '&reset=1&t=' + Date.now() : '') + '#/home';
    }
    play.addEventListener('click', function () { start(false); });
    $('demoReset').addEventListener('click', function () { start(true); $('demoPhone').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  })();

  // ---------- approval calculator (same rules as lib/screens/approvals.dart) ----------
  (function () {
    var ti = 0, q = 'good', bonus = 0;
    function pick(box, sel, attr, cb) {
      box.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; cb(b.getAttribute(attr), b); render(); });
    }
    pick($('calcTasks'), '', 'data-i', function (v, b) { ti = +v; on($('calcTasks'), b); });
    pick($('calcQ'), '', 'data-q', function (v, b) { q = v; on($('calcQ'), b); });
    pick($('calcB'), '', 'data-b', function (v, b) { var was = b.classList.contains('on'); on($('calcB'), null); bonus = was ? 0 : +v; if (!was) b.classList.add('on'); });
    function on(box, b) { [].forEach.call(box.children, function (c) { c.classList.remove('on'); }); if (b) b.classList.add('on'); }
    function render() {
      var base = YB.tasks[ti].stars, redo = q === 'redo';
      var qb = q === 'amazing' ? 3 : q === 'needs' ? -Math.floor(base * 0.4) : 0;
      var total = Math.max(1, base + qb + bonus);
      $('cBase').textContent = '+' + base + ' ⭐';
      $('cQual').textContent = (qb > 0 ? '+' : '') + qb + ' ⭐'; $('cQualRow').style.opacity = qb ? 1 : .35;
      $('cBon').textContent = '+' + bonus + ' ⭐'; $('cBonRow').style.opacity = bonus ? 1 : .35;
      var tot = $('cTotal'); tot.textContent = redo ? '🔄' : '⭐ ' + total; tot.classList.remove('tick'); void tot.offsetWidth; tot.classList.add('tick');
      $('cXp').textContent = redo ? '' : '+' + total * 10 + ' ' + $('cXp').dataset.l;
      $('cRedo').hidden = !redo; $('calcB').style.opacity = redo ? .35 : 1; $('calcB').style.pointerEvents = redo ? 'none' : '';
      document.querySelector('.calc-lines').style.opacity = redo ? .35 : 1;
    }
    render();
  })();

  // ---------- age slider ----------
  (function () {
    var input = $('age'), caps = [YB.t.g1, YB.t.g2, YB.t.g3];
    function render() {
      var a = +input.value, n = 0; $('ageOut').textContent = a;
      [].forEach.call($('ageTasks').children, function (el) { var ok = a >= +el.dataset.min && a <= +el.dataset.max; el.classList.toggle('off', !ok); if (ok) n++; });
      $('ageAvail').textContent = YB.t.age_avail.replace('{n}', n);
      var g = a <= 6 ? 1 : a <= 10 ? 2 : 3; $('agePhones').dataset.g = g; $('ageCap').textContent = caps[g - 1];
    }
    input.addEventListener('input', render); render();
  })();

  // ---------- badges ----------
  (function () {
    var box = $('badges');
    [].forEach.call(box.children, function (b, i) {
      if (S.badges.indexOf(i) >= 0) b.classList.add('won');
      b.addEventListener('click', function () {
        var open = b.classList.toggle('open');
        if (open && S.badges.indexOf(i) < 0) { S.badges.push(i); b.classList.add('won'); addStars(1, b); if (S.badges.length === box.children.length) { confetti(); addStars(5, b); } }
        if (open) setTimeout(function () { b.classList.remove('open'); }, 4200);
      });
    });
  })();
  function renderRanks() {
    var cur = null;
    [].forEach.call(document.querySelectorAll('.rank'), function (r) { var ok = S.stars >= +r.dataset.at; r.classList.toggle('on', ok); r.classList.remove('cur'); if (ok) cur = r; });
    if (cur) cur.classList.add('cur');
  }

  // ---------- reward shop ----------
  function renderShop() {
    [].forEach.call(document.querySelectorAll('.reward'), function (r, i) {
      var cost = +r.dataset.cost, btn = r.querySelector('button'), can = S.stars >= cost;
      r.classList.toggle('can', can); r.classList.toggle('done', S.bought.indexOf(i) >= 0);
      btn.textContent = can ? '🎁 ' + YB.t.rew_buy : YB.t.rew_need.replace('{n}', cost - S.stars);
      if (!btn.bound) { btn.bound = true; btn.addEventListener('click', function () {
        if (S.stars < cost) { toast(btn.textContent); return; }
        S.stars -= cost; if (S.bought.indexOf(i) < 0) S.bought.push(i); save(); renderWallet(); confetti(); toast('🎉 ' + YB.t.rew_bought);
      }); }
    });
  }

  // ---------- reveal on scroll, nav ----------
  var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .15 });
  [].forEach.call(document.querySelectorAll('.reveal'), function (el) { io.observe(el); });
  renderWallet();
})();
