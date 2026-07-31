/* ============================================================
   위클리퀴즈 공용 추적 스크립트 (track.js)  v3
   ------------------------------------------------------------
   ▸ 저장소 최상단에 이 파일 하나만 올려두면 모든 퀴즈가 공유합니다.
   ▸ 주소가 바뀌면 이 파일 한 곳만 고치면 됩니다.

   [각 퀴즈 HTML 에 아래 2줄을 </body> 위에 넣으세요]
   <script>window.QUIZ_ID='BV100'; window.QUIZ_NAME='기본동사100 스피드퀴즈';</script>
   <script src="track.js"></script>
   ============================================================ */

window.TRACK = (function () {

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbz34LKeI45F_Sj40bEgPIJOVFTvXrHIgXwyugbPPjNTVdxFVUQiYleclCnyxuTD7whaKQ/exec';   // ← 여기 한 번만 넣으면 끝

  var buffer   = [];
  var sid      = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  var did      = deviceId();
  var runNo    = 0;
  var openedAt = Date.now();

  function deviceId() {
    try {
      var id = localStorage.getItem('sq_did');
      if (!id) {
        id = 'd_' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('sq_did', id);
      }
      return id;
    } catch (e) { return 'd_temp_' + Math.random().toString(36).slice(2, 8); }
  }

  function stamp() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
           p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  function num(v) { return (v === 0 || v) && !isNaN(v) ? Number(v) : ''; }

  function log(name, o) {
    o = o || {};
    buffer.push({
      ts:     stamp(),
      name:   name,
      run:    runNo,
      week:   o.week   !== undefined ? o.week   : '',
      mode:   o.mode   !== undefined ? o.mode   : '',
      day:    num(o.day),
      source: o.source !== undefined ? o.source : '',
      qno:    num(o.qno),
      sec:    num(o.sec),
      stars:  num(o.stars),
      text:   o.text   !== undefined ? String(o.text).slice(0, 120) : ''
    });
    if (buffer.length >= 8) flush();
  }

  function startRun() { runNo++; return runNo; }

  function flush() {
    if (!buffer.length) return;
    var payload = JSON.stringify({
      qid:    window.QUIZ_ID   || 'UNKNOWN',
      qname:  window.QUIZ_NAME || document.title || '',
      sid:    sid,
      did:    did,
      ref:    document.referrer || 'direct',
      ua:     navigator.userAgent,
      events: buffer
    });
    buffer = [];

    if (ENDPOINT.indexOf('http') !== 0) { console.log('[TRACK 미설정]', payload); return; }

    try {
      var blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob)) return;
    } catch (e) {}

    try {
      fetch(ENDPOINT, {
        method: 'POST', mode: 'no-cors', keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: payload
      }).catch(function () {});
    } catch (e) {}
  }

  log('page_view');

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      log('session_pause', { sec: Math.round((Date.now() - openedAt) / 1000) });
      flush();
    }
  });
  window.addEventListener('pagehide', function () {
    log('session_end', { sec: Math.round((Date.now() - openedAt) / 1000) });
    flush();
  });
  setInterval(flush, 15000);

  return { log: log, flush: flush, startRun: startRun,
           get runNo() { return runNo; },
           get sessionSec() { return Math.round((Date.now() - openedAt) / 1000); } };
})();
