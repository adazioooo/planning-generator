# 기획서 초안 생성기

학교 교사 지원 에듀테크 서비스 내부 기획용 AI 기획서 생성기입니다.

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local.example`을 복사해서 `.env.local` 파일을 만들고 API 키를 입력하세요.

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Anthropic API 키를 입력하세요:

```
ANTHROPIC_API_KEY=sk-ant-api03-여기에-실제-키-입력
```

> API 키는 https://console.anthropic.com 에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

## 주요 기능

- **기획 유형 선택**: 기능 기획 / 화면 기획 / 콘텐츠 기획 / 메뉴 기획
- **관리자 페이지 동시 기획**: 토글로 활성화
- **화면 기획 첨부**: 이미지 업로드(Vision 분석) 또는 URL/피그마 링크
- **교사 서비스 주의사항 자동 감지**: 개인정보, 시스템 연동, 배포 타이밍 등

## 폴더 구조

```
app/
├── page.tsx                # 메인 페이지 (전체 상태 관리)
├── layout.tsx
├── globals.css
└── api/
    ├── generate/route.ts   # 기획서 생성 API (서버사이드)
    └── analyze/route.ts    # 이미지 분석 API (서버사이드)
components/
├── InputPanel.tsx          # 입력 패널 전체
├── TypeSelector.tsx        # 기획 유형 + 관리자 토글
├── DynFields.tsx           # 유형별 동적 입력 필드
├── AttachSection.tsx       # 화면 기획 첨부 (이미지/URL)
└── DocOutput.tsx           # 기획서 출력 문서
lib/
└── config.ts               # 동적 필드 설정, 프롬프트
types/
└── index.ts                # TypeScript 타입 정의
```
