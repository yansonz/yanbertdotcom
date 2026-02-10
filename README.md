# 🐕 하루의 정원 (Haru's Garden)

정원이 있는 집을 배경으로 한 2D 픽셀아트 RPG 웹 게임입니다.
주인공 하루(누런 진돗개)가 얀버트의 정원을 돌아다니며 NPC와 대화할 수 있습니다.

## 🎮 플레이

`index.html`을 브라우저에서 열면 바로 플레이할 수 있습니다.

### 조작법
- 방향키 / WASD: 이동
- Space: NPC 대화 / 우편함 확인
- 모바일: 화면 하단 D-pad + 💬 버튼

## ✨ 주요 기능

- 픽셀아트 스프라이트 (Canvas fillRect 기반)
- NPC 2명 (얀, 로버트) - 정원 내 자유 이동 AI
- 까만 길고양이 - 다가가면 도망, 도망 전 야옹 말풍선
- 실시간 날씨 연동 (Open-Meteo API, 서울 기준)
  - 비, 눈, 안개, 흐림, 폭풍, 맑음 + 기온별 효과
- 낮/밤 시스템 (KST 기준 실시간)
- 8비트 BGM (Web Audio API)
- 한/영 다국어 지원 (브라우저 언어 자동 감지)
- 우편함 - LinkedIn, Blog 링크
- 모바일 터치 컨트롤
- DungGeunMo 픽셀 폰트

## 📁 파일 구조

```
├── index.html      # 메인 HTML
├── style.css       # 스타일시트
├── game.js         # 게임 엔진 (맵, 플레이어, 카메라, 충돌)
├── sprites.js      # 픽셀아트 스프라이트 렌더링
├── npc.js          # NPC 대화 시스템
├── i18n.js         # 다국어 (한/영)
├── weather.js      # 실시간 날씨 시스템
├── daynight.js     # 낮/밤 시스템
├── music.js        # BGM (Web Audio API)
└── fonts/          # DungGeunMo 웹폰트
```

## 🌐 API

- [Open-Meteo](https://open-meteo.com/) - 날씨 데이터 (API 키 불필요)

## 📜 라이선스

MIT
