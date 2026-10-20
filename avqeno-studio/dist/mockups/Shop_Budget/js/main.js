const deals = [
  { name: '무선 미니 선풍기 (USB 충전식)', price: 9900, original: 19900, badge: '-50%', img: 'fan' },
  { name: '24팩 생수 2L · 무료배송', price: 7900, original: 12900, badge: 'HOT', img: 'water' },
  { name: '실리콘 주방 매트 4종', price: 4900, original: 9900, badge: '-50%', img: 'kitchen' },
  { name: '미니 가습기 LED 무드등', price: 12900, original: 24900, badge: '특가', img: 'humid' },
  { name: '캠핑 의자 접이식 휴대용', price: 14900, original: 29900, badge: '-50%', img: 'chair' },
  { name: '강아지 사료 10kg 대용량', price: 24900, original: 39900, badge: 'BEST', img: 'dogfood' },
  { name: '주방세제 1L 리필 3개', price: 5900, original: 11900, badge: '-50%', img: 'soap' },
  { name: '면 양말 10족 세트', price: 6900, original: 12900, badge: 'NEW', img: 'socks' }
];

const best = [
  { name: '블루투스 이어폰 5.3 (한국형)', price: 19900, original: 49900, badge: 'TOP1', img: 'earphone' },
  { name: '닥터 헬스 비타민 3개월분', price: 14900, original: 29000, badge: 'TOP2', img: 'vitamin' },
  { name: '소형 전기포트 1L 자동전원차단', price: 12900, original: 24900, badge: 'TOP3', img: 'kettle' },
  { name: '주방 종이호일 30M 3개', price: 4900, original: 9900, badge: 'TOP4', img: 'foil' },
  { name: '여성용 무봉제 브라탑 3종', price: 9900, original: 19900, badge: 'TOP5', img: 'bra' },
  { name: '대용량 보온병 1.2L 스텐', price: 16900, original: 32000, badge: 'TOP6', img: 'bottle' },
  { name: '리얼팝 통밀 시리얼 1kg', price: 6900, original: 11900, badge: 'TOP7', img: 'cereal' },
  { name: '미니 토스트기 2구 자동팝업', price: 19900, original: 39900, badge: 'TOP8', img: 'toast' }
];

const news = [
  { name: '여름 린넨 셔츠 남녀공용', price: 19900, original: 39900, badge: 'NEW', img: 'shirt' },
  { name: '실리콘 빨대 세트 10P', price: 3900, original: 6900, badge: 'NEW', img: 'straw' },
  { name: '미니 가방 크로스백 데일리', price: 14900, original: 29900, badge: 'NEW', img: 'bag' },
  { name: '쿨매트 베개 여름 침구', price: 8900, original: 17900, badge: 'NEW', img: 'pillow' },
  { name: '핸드폰 거치대 접이식', price: 2900, original: 5900, badge: 'NEW', img: 'stand' },
  { name: '아쿠아 슈즈 미끄럼방지', price: 7900, original: 15900, badge: 'NEW', img: 'shoes' }
];

const won = n => n.toLocaleString('ko-KR') + '원';
const discount = (p, o) => Math.round((1 - p / o) * 100);

function renderProducts(list, target) {
  const html = list.map(p => `
    <article class="product">
      <div class="thumb" style="background-image:url('https://picsum.photos/seed/budget-${p.img}/400/400')">
        <span class="badge">${p.badge}</span>
      </div>
      <div class="info">
        <p class="title">${p.name}</p>
        <div class="price-row">
          <span class="discount">${discount(p.price, p.original)}%</span>
          <span class="price">${won(p.price)}</span>
        </div>
        <div class="price-row">
          <span class="original">${won(p.original)}</span>
        </div>
        <div class="reviews-meta">★ 4.${Math.floor(Math.random()*5)+3} (${Math.floor(Math.random()*9000)+1000})</div>
      </div>
    </article>
  `).join('');
  document.getElementById(target).innerHTML = html;
}

renderProducts(deals, 'dealsGrid');
renderProducts(best, 'bestGrid');
renderProducts(news, 'newGrid');

// 카운트다운
(function () {
  let h = 12, m = 34, s = 56;
  const update = () => {
    s--;
    if (s < 0) { s = 59; m--; }
    if (m < 0) { m = 59; h--; }
    if (h < 0) { h = 23; }
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
  };
  setInterval(update, 1000);
})();
