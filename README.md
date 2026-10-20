# AVQENO

웹사이트 제작 스튜디오 AVQENO의 반응형 홈페이지와 인터랙티브 SVG 로고입니다.

## 로컬 실행

VS Code에서 `avqeno-studio/dist/index.html`을 **Open with Live Server**로 열거나 다음 명령을 실행하세요.

```powershell
python -m http.server 4174 --bind 127.0.0.1 --directory avqeno-studio/dist
```

- 홈페이지: http://127.0.0.1:4174/
- 로고 인터랙션 테스트: http://127.0.0.1:4174/preview.html

별도 패키지 설치 없이 실행할 수 있습니다. 정적 호스팅의 배포 디렉터리는 `avqeno-studio/dist`입니다.

## 구성

- `avqeno-studio/dist/`: 홈페이지, SVG 로고, CSS, JavaScript 및 정적 에셋
- `avqeno-studio/dist/mockups/`: 업종별 웹사이트 목업 29개
- `avqeno-studio/dist/thumbs/`: 실제 목업 렌더링으로 생성한 PNG 썸네일
- `avqeno-studio/gallery-section.html`: 홈페이지 목업 갤러리 마크업
- `avqeno-studio/build.mjs`: SVG와 갤러리 반영 및 목업 에셋 확인
- `avqeno-studio/README.md`: 로고 사용법과 구현 설명

사이트 전체 모션 ON/OFF, 움직임 줄이기 설정, 터치·키보드 조작을 지원합니다. 목업은 디자인 예시이며 실제 고객 실적이 아닙니다.

기존 `web/` 폴더의 원본 Git 저장소는 로컬 참고 자료로 유지합니다. 홈페이지에서 사용하는 AVQENO 버전은 `dist/mockups/`에 포함되어 있어 원본 폴더 없이도 실행됩니다.
