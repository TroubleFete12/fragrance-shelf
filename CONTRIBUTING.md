# 기여 가이드

이슈 제보, 기능 제안, PR 모두 환영합니다!

## 개발 환경 설정

```bash
git clone https://github.com/your-username/fragrance-shelf.git
cd fragrance-shelf
npm install
npm start
```

## 파일 구조

```
fragrance-shelf/
├── main.js        # Electron 메인 프로세스 (크롤링, IPC, 파일 I/O)
├── preload.js     # contextBridge (렌더러 ↔ 메인 통신)
├── index.html     # 전체 UI (HTML + CSS + JS 단일 파일)
├── assets/        # 아이콘 등 정적 파일
└── package.json
```

## 이슈 제보 시

- 재현 방법과 예상 동작 / 실제 동작을 포함해주세요
- Fragrantica URL 관련 문제라면 해당 URL을 함께 알려주세요
