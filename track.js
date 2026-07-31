/* ============================================================
   위클리퀴즈 공용 추적 스크립트 (track.js)  v4 — 자동 부착형
   ------------------------------------------------------------
   ▸ 퀴즈 파일 내부는 고칠 필요가 없습니다. 아래 1줄만 </body> 위에 넣으세요.

     <script src="https://cdn.jsdelivr.net/gh/사용자명/저장소명@main/track.js"></script>

   ▸ 퀴즈ID는 주소에서 자동으로 만들어집니다. 파일마다 다르게 적을 필요 없음.
     (직접 지정하려면 위 줄 앞에 <script>window.QUIZ_ID='BV100_W1';</script>)
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
      qid: autoId(),
      qname: (document.title || '').slice(0, 80),
      sid: sid, did: did,
      ref: document.referrer || 'direct',
      ua: navigator.userAgent,
      events: buffer
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


/* ===== 퀴즈 화면을 스스로 읽어 자동 부착 ===== */
(function () {

  var runStart = 0, qStart = 0, mode = '', starSet = {}, starN = 0;

  function el(id) { return document.getElementById(id); }
  function txt(id) { var e = el(id); return e ? (e.innerText || '').trim() : ''; }

  function week() {
    var t = document.querySelector('.active-tab');
    return t ? (t.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 20) : '';
  }
  function prog(i) {
    var m = txt('progress-text').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? Number(m[i]) : '';
  }
  function info() {
    var m = txt('q-info').match(/Day\s*0*(\d+)\s*[-\u2013]\s*(.+)/i);
    return m ? { day: Number(m[1]), src: m[2].trim() } : { day: '', src: '' };
  }
  function eng() { return txt('q-english'); }
  function onQuiz() {
    var s = el('quiz-screen');
    return !!(s && !s.classList.contains('hidden'));
  }
  function flipped() {
    var c = el('card-container');
    return !!(c && c.classList.contains('flipped'));
  }
  function secFrom(t) { return t ? Math.round((Date.now() - t) / 1000) : ''; }

  function ctx(extra) {
    var i = info();
    var o = { week: week(), mode: mode, day: i.day, source: i.src, qno: prog(1), text: eng() };
    for (var k in extra) o[k] = extra[k];
    return o;
  }

  function logView() {
    if (!onQuiz() || !eng()) return;
    qStart = Date.now();
    TRACK.log('question_view', ctx());
  }

  function wrap(name, before, after) {
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

  function attach() {
    wrap('selectWeek', null, function () { TRACK.log('week_select', { week: week() }); });

    wrap('startQuiz',
      function (m) { mode = m || ''; starSet = {}; starN = 0; TRACK.startRun(); runStart = Date.now(); },
      function (m) { TRACK.log('quiz_start', { week: week(), mode: m, qno: prog(2) }); logView(); });

    wrap('flipCard', function () {
      if (flipped() || !onQuiz()) return;
      TRACK.log('card_flip', ctx({ sec: secFrom(qStart) }));
    });

    wrap('toggleStar', null, function () {
      var b = el('star-btn');
      var on = !!(b && b.classList.contains('star-checked'));
      var t = eng();
      if (on && !starSet[t]) { starSet[t] = 1; starN++; }
      if (!on && starSet[t]) { delete starSet[t]; starN--; }
      TRACK.log(on ? 'star_on' : 'star_off', ctx());
    });

    wrap('playTTS', function () { if (onQuiz()) TRACK.log('tts_play', ctx()); });

    wrap('nextQuestion',
      function () { if (onQuiz()) TRACK.log('next_click', ctx({ sec: secFrom(qStart) })); },
      function () { logView(); });

    wrap('showResults', function () {
      TRACK.log('quiz_complete', { week: week(), mode: mode, qno: prog(2),
                                   stars: starN, sec: secFrom(runStart) });
      TRACK.flush();
    });

    wrap('exitQuiz', function () {
      TRACK.log('exit_midway', { week: week(), mode: mode, qno: prog(1),
                                 stars: starN, sec: secFrom(runStart) });
      TRACK.flush();
    });

    wrap('goHome', function () { TRACK.log('back_to_home', { week: week(), mode: mode }); TRACK.flush(); });

    /* Exit 버튼이 location.reload() 로만 되어 있는 옛 파일 대응 */
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('button');
      if (!b || !onQuiz()) return;
      if (/exit/i.test(b.innerText || '') && typeof window.exitQuiz !== 'function') {
        TRACK.log('exit_midway', { week: week(), mode: mode, qno: prog(1),
                                   stars: starN, sec: secFrom(runStart) });
        TRACK.flush();
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
