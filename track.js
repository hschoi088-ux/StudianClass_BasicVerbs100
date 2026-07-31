/* ============================================================
   위클리퀴즈 공용 추적 스크립트 (track.js)  v6
   ------------------------------------------------------------
   지원하는 퀴즈 틀
     A형 : 기본동사100 스피드퀴즈  (카드 뒤집기 / 1 / 10)
     B형 : 스피드 영어 퀴즈        (구동사·회화 / 문제 N / 7)
     C형 : 그 외 (버튼 이름으로 최대한 추정)

   퀴즈 파일은 고칠 필요 없습니다. </body> 위에 아래 1줄만.
   <script src="https://hschoi088-ux.github.io/StudianClass_BasicVerbs100/track.js"></script>
   ============================================================ */

window.TRACK = (function () {

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbz34LKeI45F_Sj40bEgPIJOVFTvXrHIgXwyugbPPjNTVdxFVUQiYleclCnyxuTD7whaKQ/exec';

  var buffer = [], runNo = 0, openedAt = Date.now();
  var sid = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  var did = (function () {
    try {
      var id = localStorage.getItem('sq_did');
      if (!id) { id = 'd_' + Math.random().toString(36).slice(2, 10); localStorage.setItem('sq_did', id); }
      return id;
    } catch (e) { return 'd_temp_' + Math.random().toString(36).slice(2, 8); }
  })();

  function autoId() {
    if (window.QUIZ_ID) return String(window.QUIZ_ID);
    var p = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    var last = p[p.length - 1] || 'root';
    if (/^index\.html?$/i.test(last)) last = p[p.length - 2] || 'root';
    return decodeURIComponent(last).replace(/\.html?$/i, '').slice(0, 60);
  }

  function stamp() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
           p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  function num(v) { return (v === 0 || (v && !isNaN(v))) ? Number(v) : ''; }

  function log(name, o) {
    o = o || {};
    buffer.push({
      ts: stamp(), name: name, run: runNo,
      week: o.week !== undefined ? o.week : '',
      mode: o.mode !== undefined ? o.mode : '',
      day: num(o.day), source: o.source !== undefined ? o.source : '',
      qno: num(o.qno), sec: num(o.sec), stars: num(o.stars),
      text: o.text !== undefined ? String(o.text).slice(0, 120) : ''
    });
    if (buffer.length >= 8) flush();
  }

  function flush() {
    if (!buffer.length) return;
    var payload = JSON.stringify({
      qid: autoId(), qname: (document.title || '').slice(0, 80),
      sid: sid, did: did, ref: document.referrer || 'direct',
      ua: navigator.userAgent, events: buffer
    });
    buffer = [];
    if (ENDPOINT.indexOf('http') !== 0) { console.log('[TRACK 미설정]', payload); return; }
    try {
      var blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob)) return;
    } catch (e) {}
    try {
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: payload }).catch(function () {});
    } catch (e) {}
  }

  log('page_view');
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      log('session_pause', { sec: Math.round((Date.now() - openedAt) / 1000) }); flush();
    }
  });
  window.addEventListener('pagehide', function () {
    log('session_end', { sec: Math.round((Date.now() - openedAt) / 1000) }); flush();
  });
  setInterval(flush, 15000);

  return { log: log, flush: flush, startRun: function () { runNo++; return runNo; } };
})();


/* ===== 공통 도우미 ===== */
function _TQwrap(name, before, after) {
  var orig = window[name];
  if (typeof orig !== 'function') return false;
  window[name] = function () {
    try { if (before) before.apply(null, arguments); } catch (e) {}
    var r = orig.apply(this, arguments);
    try { if (after) after.apply(null, arguments); } catch (e) {}
    return r;
  };
  return true;
}
function _TQel(id) { return document.getElementById(id); }
function _TQtxt(id) { var e = _TQel(id); return e ? (e.innerText || '').trim() : ''; }
function _TQsec(t) { return t ? Math.round((Date.now() - t) / 1000) : ''; }


/* =========================================================
   A형 — 기본동사100 스피드퀴즈
   ========================================================= */
function attachTypeA() {
  var runStart = 0, qStart = 0, mode = '', starSet = {}, starN = 0;

  function week() {
    var t = document.querySelector('.active-tab');
    return t ? (t.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 20) : '';
  }
  function prog(k) {
    var m = _TQtxt('progress-text').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? Number(k === 'now' ? m[1] : m[2]) : '';
  }
  function info() {
    var m = _TQtxt('q-info').match(/Day\s*0*(\d+)\s*[-\u2013]\s*(.+)/i);
    return m ? { day: Number(m[1]), src: m[2].trim() } : { day: '', src: '' };
  }
  function eng() { return _TQtxt('q-english'); }
  function onQuiz() { var s = _TQel('quiz-screen'); return !!(s && !s.classList.contains('hidden')); }
  function flipped() { var c = _TQel('card-container'); return !!(c && c.classList.contains('flipped')); }

  function ctx(extra) {
    var i = info();
    var o = { week: week(), mode: mode, day: i.day, source: i.src, qno: prog('now'), text: eng() };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  function logView() {
    if (!onQuiz() || !eng()) return;
    qStart = Date.now();
    TRACK.log('question_view', ctx());
  }

  _TQwrap('selectWeek', null, function () { TRACK.log('week_select', { week: week() }); });
  _TQwrap('startQuiz',
    function (m) { mode = m || ''; starSet = {}; starN = 0; TRACK.startRun(); runStart = Date.now(); },
    function (m) { TRACK.log('quiz_start', { week: week(), mode: m, qno: prog('total') }); logView(); });
  _TQwrap('flipCard', function () {
    if (flipped() || !onQuiz()) return;
    TRACK.log('card_flip', ctx({ sec: _TQsec(qStart) }));
  });
  _TQwrap('toggleStar', null, function () {
    var b = _TQel('star-btn'), t = eng();
    var on = !!(b && b.classList.contains('star-checked'));
    if (on && !starSet[t]) { starSet[t] = 1; starN++; }
    if (!on && starSet[t]) { delete starSet[t]; starN--; }
    TRACK.log(on ? 'star_on' : 'star_off', ctx());
  });
  _TQwrap('playTTS', function () { if (onQuiz()) TRACK.log('tts_play', ctx()); });
  _TQwrap('nextQuestion',
    function () { if (onQuiz()) TRACK.log('next_click', ctx({ sec: _TQsec(qStart) })); },
    function () { logView(); });
  _TQwrap('showResults', function () {
    TRACK.log('quiz_complete', { week: week(), mode: mode, qno: prog('total'),
                                 stars: starN, sec: _TQsec(runStart) });
    TRACK.flush();
  });
  _TQwrap('exitQuiz', function () {
    TRACK.log('exit_midway', { week: week(), mode: mode, qno: prog('now'),
                               stars: starN, sec: _TQsec(runStart) });
    TRACK.flush();
  });
  _TQwrap('goHome', function () { TRACK.log('back_to_home', { week: week(), mode: mode }); TRACK.flush(); });
}


/* =========================================================
   B형 — 스피드 영어 퀴즈 (구동사 / 영어회화)
   ========================================================= */
function attachTypeB() {
  var runStart = 0, qStart = 0, mode = '', cat = '', starSet = {}, starN = 0;

  /* 이 페이지가 담당하는 주차 (탭은 고정) */
  function week() {
    var t = document.querySelector('.week-tab.active');
    return t ? (t.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 20) : '';
  }
  function qno() {
    var m = _TQtxt('question-counter').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? Number(m[1]) : '';
  }
  function total() {
    var m = _TQtxt('question-counter').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? Number(m[2]) : '';
  }
  /* "출처: Day001 교재1" / "출처: Day 5 교재1" / "출처: Day001 대표" */
  function info() {
    var m = _TQtxt('source-info').match(/Day\s*0*(\d+)\s*(.*)$/i);
    var rest = m ? m[2].trim() : '';
    return { day: m ? Number(m[1]) : '', src: (cat ? cat + '\u00b7' : '') + rest };
  }
  function eng() { return _TQtxt('en-text'); }
  function onQuiz() { var a = _TQel('quiz-area'); return !!(a && !a.classList.contains('hidden')); }

  function ctx(extra) {
    var i = info();
    var o = { week: week(), mode: mode, day: i.day, source: i.src, qno: qno(), text: eng() };
    for (var k in extra) o[k] = extra[k];
    return o;
  }

  var MODE_MAP = {
    'phrasal-easy': { m: 'mild',  c: '\uad6c\ub3d9\uc0ac' },
    'phrasal-hard': { m: 'spicy', c: '\uad6c\ub3d9\uc0ac' },
    'conv-easy':    { m: 'mild',  c: '\uc601\uc5b4\ud68c\ud654' },
    'conv-hard':    { m: 'spicy', c: '\uc601\uc5b4\ud68c\ud654' }
  };

  _TQwrap('startQuiz',
    function (raw) {
      var t = MODE_MAP[raw] || { m: raw || '', c: '' };
      mode = t.m; cat = t.c;
      starSet = {}; starN = 0;
      TRACK.startRun(); runStart = Date.now();
    },
    function (raw) {
      TRACK.log('quiz_start', { week: week(), mode: mode, qno: total(), source: cat, text: raw });
    });

  /* 문제가 새로 뜰 때마다 */
  _TQwrap('loadQuestion', null, function () {
    if (!onQuiz()) return;
    qStart = Date.now();
    TRACK.log('question_view', ctx());
  });

  /* 한국어 박스를 눌러 정답을 여는 순간 = 고민 시간 종료 */
  _TQwrap('showAnswer', function () {
    var s = _TQel('answer-section');
    if (s && !s.classList.contains('hidden')) return;   // 이미 열려 있으면 무시
    TRACK.log('card_flip', ctx({ sec: _TQsec(qStart) }));
  });

  _TQwrap('playTTS', function () { TRACK.log('tts_play', ctx()); });

  _TQwrap('toggleStar', null, function () {
    var b = _TQel('btn-star'), t = eng();
    var on = !!(b && b.classList.contains('active'));
    if (on && !starSet[t]) { starSet[t] = 1; starN++; }
    if (!on && starSet[t]) { delete starSet[t]; starN--; }
    TRACK.log(on ? 'star_on' : 'star_off', ctx());
  });

  _TQwrap('nextQuestion', function () {
    TRACK.log('next_click', ctx({ sec: _TQsec(qStart) }));
  });

  _TQwrap('showReview', function () {
    TRACK.log('next_click', ctx({ sec: _TQsec(qStart) }));
    TRACK.log('quiz_complete', { week: week(), mode: mode, qno: total(), source: cat,
                                 stars: starN, sec: _TQsec(runStart) });
    TRACK.flush();
  });

  _TQwrap('resetToHome', function () {
    TRACK.log('back_to_home', { week: week(), mode: mode, source: cat });
    TRACK.flush();
  });
}


/* =========================================================
   C형 — 알 수 없는 틀: 버튼 이름으로 추정
   ========================================================= */
function attachTypeC() {
  var week = '', mode = '', runStart = 0, qStart = 0, starN = 0, lastQ = '';

  function leaves() {
    var out = [], all = document.querySelectorAll('div,span,p,h2,h3,strong,b,small,label');
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.children.length || e.offsetParent === null) continue;
      var t = (e.textContent || '').trim().replace(/\s+/g, ' ');
      if (t) out.push(t);
    }
    return out;
  }
  function prog(i) {
    var L = leaves();
    for (var k = 0; k < L.length; k++) {
      if (L[k].length > 30) continue;
      var m = L[k].match(/(\d+)\s*\/\s*(\d+)/);
      if (m) return Number(m[i]);
    }
    return '';
  }
  function info() {
    var L = leaves();
    for (var k = 0; k < L.length; k++) {
      if (L[k].length > 60) continue;
      var m = L[k].match(/Day\s*0*(\d+)\s*(.*)$/i);
      if (m) return { day: Number(m[1]), src: (m[2] || '').replace(/^[\s:\-]+/, '').slice(0, 30) };
    }
    return { day: '', src: '' };
  }
  function ctx(extra) {
    var i = info();
    var o = { week: week, mode: mode, day: i.day, source: i.src, qno: prog(1) };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  function kind(t) {
    if (/순한맛|mild/i.test(t))               return { ev: 'quiz_start', mode: 'mild' };
    if (/매운맛|spicy/i.test(t))              return { ev: 'quiz_start', mode: 'spicy' };
    if (/^(Week|W)\s*\d+/i.test(t))           return { ev: 'week_select' };
    if (/듣기|🔊|발음/i.test(t))               return { ev: 'tts_play' };
    if (/어려|⭐|star|북마크/i.test(t))         return { ev: 'star_toggle' };
    if (/다음|next|➡/i.test(t))               return { ev: 'next_click' };
    if (/결과|오답|리포트/i.test(t))           return { ev: 'quiz_complete' };
    if (/처음|메인|home|🏠/i.test(t))          return { ev: 'back_to_home' };
    if (/exit|나가|종료|✕/i.test(t))          return { ev: 'exit_midway' };
    if (/정답|확인|뒤집/i.test(t))             return { ev: 'card_flip' };
    return { ev: 'other_click' };
  }

  document.addEventListener('click', function (e) {
    var n = e.target;
    while (n && n !== document.body &&
           !(n.tagName === 'BUTTON' || n.tagName === 'A' || (n.getAttribute && n.getAttribute('onclick')))) n = n.parentNode;
    if (!n || n === document.body) return;
    var t = (n.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    if (!t) return;
    var k = kind(t);

    if (k.ev === 'week_select')  { week = t.slice(0, 20); TRACK.log('week_select', { week: week }); return; }
    if (k.ev === 'quiz_start') {
      mode = k.mode; starN = 0; TRACK.startRun(); runStart = qStart = Date.now(); lastQ = '';
      setTimeout(function () { TRACK.log('quiz_start', { week: week, mode: mode, qno: prog(2), text: t }); }, 250);
      return;
    }
    if (k.ev === 'star_toggle')  { starN++; TRACK.log('star_toggle', ctx()); return; }
    if (k.ev === 'tts_play')     { TRACK.log('tts_play', ctx()); return; }
    if (k.ev === 'card_flip')    { TRACK.log('card_flip', ctx({ sec: _TQsec(qStart) })); return; }
    if (k.ev === 'next_click')   { TRACK.log('next_click', ctx({ sec: _TQsec(qStart) })); return; }
    if (k.ev === 'quiz_complete') {
      TRACK.log('quiz_complete', { week: week, mode: mode, qno: prog(2), stars: starN, sec: _TQsec(runStart) });
      TRACK.flush(); return;
    }
    if (k.ev === 'exit_midway') {
      TRACK.log('exit_midway', { week: week, mode: mode, qno: prog(1), stars: starN, sec: _TQsec(runStart) });
      TRACK.flush(); return;
    }
    if (k.ev === 'back_to_home') { TRACK.log('back_to_home', { week: week, mode: mode }); TRACK.flush(); return; }
    TRACK.log('other_click', { week: week, mode: mode, text: t });
  }, true);

  setInterval(function () {
    if (!runStart) return;
    var q = prog(1);
    if (q === '' || q === lastQ) return;
    lastQ = q; qStart = Date.now();
    TRACK.log('question_view', ctx());
  }, 400);
}


/* ===== 어느 틀인지 판별 ===== */
(function () {
  function go() {
    var A = _TQel('card-container') && _TQel('q-english') && typeof window.startQuiz === 'function';
    var B = _TQel('question-counter') && _TQel('en-text') && typeof window.loadQuestion === 'function';
    if (A) attachTypeA();
    else if (B) attachTypeB();
    else attachTypeC();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
