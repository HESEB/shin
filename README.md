# shin

축산구매 서바이벌 게임 프로젝트입니다.

## 현재 단계
- `shin` 프로젝트 구조 생성
- 월드맵 / 저장 / 개발자모드 / 결과 저장 기반 구축
- 이후 기존 MVP 게임 로직을 `games/*/index.html` 안으로 순차 이식 예정

## 기본 구조
```text
assets/
  bg/ boss/ enemy/ player/ sfx/ music/ ui/
css/
  common.css theme.css hud.css animation.css
js/
  engine.js save.js world.js ui.js result.js sound.js developer.js
games/
  farm/ bid/ butcher/ packing/ sales/ boss/
data/
  stages.json balance.json save.json
```

## 조작 기준
- 이동: WASD / 방향키
- 확인·공격: Space
- 스킬: E
- 폐기·회복: Q
- 일시정지: P / Esc
- 보스전: 모바일 좌측 터치 투명 조이스틱
