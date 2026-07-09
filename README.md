<div align="center">

# 🧴 Fragrance Shelf

**나만의 향수 컬렉션을 시각적인 진열장으로 관리하는 데스크탑 앱**

Fragrantica URL 하나만 붙여넣으면 향수 이미지, 브랜드 로고, 노트 정보를 자동으로 가져와 아름다운 진열장을 만들어줍니다.

![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey)
![Electron](https://img.shields.io/badge/Electron-28-47848f?logo=electron)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## ✨ 주요 기능

### 컬렉션 관리
- **URL 추가** — Fragrantica 향수 페이지 URL을 붙여넣으면 이름, 브랜드, 이미지, 노트가 자동 크롤링
- **여러 진열장** — 탭으로 여러 컬렉션을 분리해서 관리 (ex. 보유 향수 / 위시리스트)
- **별점** — 향수마다 1~5점 평가
- **Owned / Wishlist** 구분 — 소유 중인 향수와 구매 희망 향수 분리
- **태그** — 자유롭게 태그를 붙여 필터링 (계절별, 상황별 등)
- **Export / Import** — JSON 파일로 백업 및 복원

### 시각화
- **진열장 레이아웃** — 브랜드별로 그룹화, 알파벳순 자동 정렬
- **브랜드 로고** — Fragrantica에서 자동으로 로고 이미지 가져오기
- **노트 툴팁** — 병 위에 마우스를 올리면 탑/하트/베이스 노트 표시
- **PNG 저장** — 현재 진열장을 고해상도(2x) PNG로 저장
- **클립보드 복사** — PNG를 클립보드에 바로 복사

### 커스터마이즈
- **폰트** — 10종 폰트 선택 (Jost, Inter, Cormorant Garamond 등)
- **브랜드 색상** — 우클릭으로 브랜드별 컬러 변경
- **배경색** — 셸프 배경을 화이트/크림/다크 등 10가지 색상으로 변경
- **병 크기** — 줌 슬라이더로 자유롭게 조절
- **열 개수** — 한 줄에 표시할 병 개수 조절
- **드래그** — 브랜드 헤더를 드래그해서 순서 변경
- **브랜드 내 정렬** — 우클릭 메뉴에서 이름 오름/내림차순
- **별점 보이기/숨기기** — 툴바 버튼으로 토글

---

## 🚀 시작하기

### 다운로드 (권장)

[Releases](https://github.com/your-username/fragrance-shelf/releases) 페이지에서 운영체제에 맞는 설치 파일을 다운로드하세요.

| OS | 파일 |
|---|---|
| macOS | `Fragrance-Shelf-x.x.x.dmg` |
| Windows | `Fragrance-Shelf-Setup-x.x.x.exe` |

### 직접 실행 (개발자)

**요구사항:** Node.js 18 이상

```bash
# 저장소 클론
git clone https://github.com/your-username/fragrance-shelf.git
cd fragrance-shelf

# 의존성 설치
npm install

# 실행
npm start
```

### 빌드

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

---

## 📖 사용법

### 향수 추가

1. Fragrantica에서 원하는 향수 페이지를 엽니다
2. URL을 복사합니다  
   예) `https://www.fragrantica.com/perfume/Creed/Aventus-9828.html`
3. 앱에서 **+ Add** 버튼을 클릭하고 URL을 붙여넣습니다
4. 향수 정보가 자동으로 불러와지면 추가됩니다

### 브랜드 설정

- **우클릭** → 브랜드 헤더를 우클릭하면 정렬 / 색상 / 배경 변경 메뉴가 나타납니다
- **드래그** → 브랜드 헤더를 드래그해서 원하는 순서로 배치합니다

### 향수 상세

- **클릭** → 병을 클릭하면 상세 모달이 열립니다
  - 별점 설정
  - Owned / Wishlist 상태 변경
  - 태그 추가/삭제
  - 탑/하트/베이스 노트 확인
  - Fragrantica 페이지로 바로 이동

### PNG 저장

- **Save PNG** — 시스템 저장 다이얼로그로 파일 저장 (파일명에 날짜 자동 포함)
- **Copy** — 클립보드에 복사 (SNS에 바로 붙여넣기 가능)

### 백업

- **Export** → JSON 파일로 전체 데이터 내보내기
- **Import** → 백업 파일 불러오기 (기존 데이터 대체)

---

## 🗂 데이터 저장 위치

앱 데이터는 시스템 userData 폴더에 JSON 파일로 저장됩니다.

| OS | 경로 |
|---|---|
| macOS | `~/Library/Application Support/fragrance-shelf/` |
| Windows | `%APPDATA%\fragrance-shelf\` |

---

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| 프레임워크 | [Electron](https://www.electronjs.org/) 28 |
| 빌드 | [electron-builder](https://www.electron.build/) |
| 이미지 소스 | [Fragrantica](https://www.fragrantica.com/) |
| HTML 렌더링 → 이미지 | [html2canvas](https://html2canvas.hertzen.com/) |
| 폰트 | [Google Fonts](https://fonts.google.com/) |
| 데이터 저장 | Node.js `fs` + JSON |

외부 백엔드 없음, 모든 데이터는 로컬에 저장됩니다.

---

## ⚠️ 주의사항

- 이 앱은 Fragrantica의 공개 페이지에서 정보를 가져옵니다. Fragrantica의 서버 부하를 줄이기 위해 한 번에 하나씩 추가해주세요.
- Fragrantica의 HTML 구조 변경 시 크롤링이 실패할 수 있습니다. URL 방식으로 추가 시 이름/브랜드는 URL에서 파싱된 값으로 대체됩니다.
- 이 프로젝트는 Fragrantica와 공식적인 관계가 없는 개인 프로젝트입니다.

---

## 📄 라이선스

MIT License — 자유롭게 사용, 수정, 배포 가능합니다.
