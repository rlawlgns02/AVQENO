// 솔루션 탭
const tabData = {
  dev: {
    title: '스프린트, 백로그, 릴리즈 노트까지 한 곳에서.',
    desc: '개발자가 가장 싫어하는 일은 같은 정보를 두 번 입력하는 거. Flowmark는 GitHub 커밋과 PR을 자동으로 이슈에 연결합니다. 릴리즈 노트 작성도 1클릭.',
    list: ['✓ GitHub / GitLab 양방향 동기화', '✓ 스프린트 자동 번다운 차트', '✓ 릴리즈 노트 AI 작성', '✓ 슬랙으로 이슈 상태 알림']
  },
  pm: {
    title: '로드맵, 리소스, 일정. 매주 30분의 회의가 끝납니다.',
    desc: 'PM의 90%는 정렬 작업입니다. Flowmark는 부서별 OKR과 개별 이슈를 자동으로 연결합니다. 매주의 weekly는 한 화면에서 끝나죠.',
    list: ['✓ OKR / KPI 자동 트래킹', '✓ 워크로드 시각화', '✓ 변경 사항 데일리 다이제스트', '✓ 의사결정 히스토리 자동 기록']
  },
  design: {
    title: '피그마 옆에 두는 디자인 작업판.',
    desc: '디자이너의 작업은 결국 다른 팀이 보고 결정해야 살아납니다. Flowmark는 피그마 프레임을 그대로 가져와 코멘트와 결정을 한 곳에 모읍니다.',
    list: ['✓ Figma 프레임 라이브 임베드', '✓ 결정 사항 1줄 요약 자동', '✓ QA 단계 코멘트 자동 이슈화', '✓ 디자인 시스템 라이브러리 동기화']
  },
  ops: {
    title: 'HR, 재무, 법무 — 백오피스도 흐름이 됩니다.',
    desc: '백오피스 업무는 흩어진 양식과 메일로 가득합니다. Flowmark는 양식을 자동화하고, 결재 라인을 시각화해 평균 처리 시간을 절반으로 줄입니다.',
    list: ['✓ 결재 라인 시각 워크플로우', '✓ 양식 → 이슈 자동 변환', '✓ 감사로그 무제한 보존', '✓ 외부 회계/노무 도구 연동']
  }
};

document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const d = tabData[btn.dataset.tab];
    if (!d) return;
    document.getElementById('sol-title').textContent = d.title;
    document.getElementById('sol-desc').textContent = d.desc;
    document.getElementById('sol-list').innerHTML = d.list.map((s) => `<li>${s}</li>`).join('');
  });
});

// 페이드 인
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.feat, .case, .price-card').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});
