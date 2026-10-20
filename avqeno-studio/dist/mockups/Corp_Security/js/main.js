// 실시간 공격 카운터
(function () {
  const el = document.getElementById('t-attacks');
  if (!el) return;
  let n = 3742184;
  setInterval(() => {
    n += Math.floor(Math.random() * 12 + 3);
    el.textContent = n.toLocaleString('en-US');
  }, 800);
})();

// 라이브 로그 스트림
(function () {
  const log = document.getElementById('log');
  if (!log) return;
  const samples = [
    { c: 't-warn', t: 'IR → DE · sql_injection · BLOCKED' },
    { c: 't-ok', t: 'malware_sample · sandbox_detonated · QUARANTINED 388ms' },
    { c: 't-warn', t: 'KR → KR · privilege_escalation · web-22 · STOPPED' },
    { c: 't-info', t: 'threat_intel_feed · 12.4k indicators updated' },
    { c: 't-ok', t: 'phishing_url · dns_sinkhole · 411ms' },
    { c: 't-warn', t: 'CN → JP · webshell_upload · DETECTED + ISOLATED' },
    { c: 't-ok', t: 'lateral_movement · auto_quarantine · 402ms' },
    { c: 't-warn', t: 'RU → KR · c2_beacon · cordoned' },
    { c: 't-info', t: 'ioc_cluster_TA-7714 expanded · 84 new hashes' }
  ];
  function pad(n) { return String(n).padStart(2, '0'); }
  function ts() {
    const d = new Date();
    return `[${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`;
  }
  setInterval(() => {
    const s = samples[Math.floor(Math.random() * samples.length)];
    const p = document.createElement('p');
    p.className = s.c;
    p.textContent = `${ts()} ${s.t}`;
    log.insertBefore(p, log.firstChild);
    while (log.children.length > 6) log.removeChild(log.lastChild);
  }, 1600);
})();

// 페이드인
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.pl-card, .why-row, .pf-card, .blog-card').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});
