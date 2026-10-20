# AVQENO — 브랜드 웹사이트 & 인터랙티브 SVG

브랜드가 가진 이야기를 직접 만나 발견하고, 고유한 웹사이트로 만드는 스튜디오를 위한 랜딩 페이지입니다. 참고 사이트의 소스·이미지·문구는 사용하지 않았습니다. 아이보리 / 딥그린 / 라임과 직접 작성한 벡터·CSS 그래픽으로 구성했습니다.

## 실행

`dist/index.html`을 브라우저로 열면 사이트가 실행됩니다. `dist/preview.html`은 독립적인 로고 테스트 페이지입니다. 주요 코드와 로고는 외부 라이브러리를 요구하지 않습니다. Google Fonts가 차단되면 시스템 폰트로 표시됩니다.

```powershell
cd D:\dev\AVQENO\avqeno-studio
node build.mjs
python -m http.server 4174 --bind 127.0.0.1 --directory dist
```

## 파일

- `dist/logo.svg`: 투명 배경, 정적 벡터 심볼. OS 다크 모드 자동 대응.
- `dist/logo-light.svg`: 밝은 배경용 정적 심볼.
- `dist/logo-animated.svg`: 애니메이션 스크립트가 내부에 포함된 독립형 SVG.
- `dist/logo-inline.svg`: 웹사이트에 직접 삽입할 SVG 마크업.
- `dist/animation.js`: 재사용할 수 있는 모션 엔진.
- `dist/preview.html`, `dist/preview.js`: 타임라인, 라이트/다크, 모션 ON/OFF, 동작 검증 도구.
- `dist/index.html`, `dist/styles.css`, `dist/site.js`: 반응형 사이트.
- `build-logo.mjs`: 원본 경로, 정밀 분할, SVG 생성.
- `build.mjs`: 원본 목업이 있으면 가져오고, 갤러리 및 SVG를 HTML에 반영.
- `import-mockups.py`: Python 표준 라이브러리로 목업 복사 및 AVQENO 이름 적용. PNG 썸네일은 실제 브라우저로 캡처한 파일을 사용합니다.

## 로고 설계와 구현

상승하는 A 윤곽과 Q의 꼬리를 연결한 리본 심볼입니다. 여섯 경로는 시작 상태에서 연결되며, 브랜드명으로 펼쳐질 때 글자별로 분리됩니다. 모든 중간 프레임에서 여섯 글자가 서로 연결된 상태를 유지하는 구현은 아닙니다.

각 경로는 `M + 16 C` 구조를 가지며 cubic Bézier 제어점과 끝점 자체를 보간합니다. 같은 DOM path가 A/V/Q/E/N/O의 글자 획이 됩니다. 텍스트 표시나 이미지 교체, opacity 교차 전환은 없습니다. 펼쳐질 때 중심 위치가 형태 변형보다 조금 먼저 이동해 경로 간 충돌을 줄였습니다.

- 전체 시간: 1,400ms
- 전체 타임라인 easing: `cubic-bezier(0.65, 0, 0.35, 1)`
- requestAnimationFrame, 진행 위치를 보존하는 역재생
- 호버 진입/이탈, 키보드 포커스/해제, Enter/Space/Escape, 터치 탭
- `prefers-reduced-motion` 및 사이트 모션 OFF에서 정적 심볼
- 정적 상태에서 rAF 정지, 반복 재생 없음

## 웹사이트에서 재사용

### 독립형 SVG

```html
<object data="logo-animated.svg" type="image/svg+xml"
        aria-label="AVQENO 인터랙티브 로고"
        style="width:min(100%,600px);aspect-ratio:900/320">
  <img src="logo.svg" alt="AVQENO">
</object>
```

직접 SVG 파일을 열거나 `<object>`로 삽입하면 내장 JavaScript가 실행됩니다. **`<img>` 및 CSS background로 삽입한 SVG에서는 브라우저 보안 정책으로 JavaScript가 실행되지 않습니다.** 강한 CSP로 inline script가 금지된 환경에서는 아래 인라인 SVG + 외부 JS 방식을 사용하세요.

### 인라인 SVG + 외부 JavaScript

`logo-inline.svg` 마크업을 원하는 위치에 넣고 `animation.js`를 한 번 불러오면 자동 마운트됩니다. 여러 복제본을 넣는다면 gradient의 ID와 `stroke="url(#...)"` 참조를 인스턴스마다 고유하게 변경하세요.

```html
<!-- logo-inline.svg의 실제 <svg> 마크업 -->
<script src="animation.js" defer></script>
```

```js
const controller = AVQENO.mount(document.querySelector('[data-avqeno]'));
controller.play();
controller.reverse();
controller.seek(0.5); // 검수용 수동 진행률
controller.setMotion(false);
controller.destroy(); // SPA에서 제거할 때
```

`data-theme="light"` / `"dark"`로 배경에 맞는 팔레트를 지정하거나 `--logo-a`, `--logo-b`, `--logo-c`를 설정할 수 있습니다.

## 사이트 기능

모바일 메뉴, 업종별 콘셉트 필터, 상세 다이얼로그, 제작 과정 아코디언, 상담 준비서 다운로드, 로고 path morph, 스크롤 등장, 궤도 모션, 티커, 떠 있는 디바이스 그래픽을 구현했습니다. 모션 설정은 브라우저에 저장되며 OS 움직임 줄이기 설정이 우선합니다.

`web/web-mockup`의 실제 목업 29개를 `dist/mockups/`로 가져와 갤러리에 표시합니다. 원본은 변경하지 않으며 표시 브랜드를 AVQENO로 통일합니다. 실제 브라우저 렌더링 썸네일은 `dist/thumbs/*.png`, 목록은 `dist/mockups-data.js`, 업종 필터와 흐름 갤러리는 `dist/gallery.js`입니다. 전체 29개 목록과 8개 업종 필터를 지원하고, 모션 OFF에서는 정적 그리드로 표시합니다. 이 화면들은 디자인 목업이며 실적이 아닙니다. 실제 고객 후기, 수치, 사업자 정보를 임의로 만들지 않았습니다. 사용자가 제공한 `KJHrlawlgns02@gmail.com`과 `https://pf.kakao.com/_WVximX`를 상담 채널로 연결했습니다. 이메일 상담은 작성한 내용을 `mailto:`로 이메일 앱에 전달합니다. 실제 전송은 사용자가 이메일 앱에서 보내기를 눌러야 이루어집니다. 별도의 서버 발송은 없습니다. 상담 준비서 다운로드 기능도 사용할 수 있습니다.

## 검증

`preview.html`에서 **동작 검증 실행**을 누르면 동일 path 유지, 3단계 좌표, 경로 구조, 경계, 역재생, 1.4초 재생, 포인터 이벤트, 터치 이벤트, 모션 OFF, 접근성 속성을 검사합니다. 실제 렌더링과 반응형 검증 기록은 `qa/verification.md`를 참고하세요.
