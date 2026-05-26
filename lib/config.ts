import { DynConfig } from '@/types'

export const DYN_CONFIG: Record<string, DynConfig> = {
  '기능 기획': {
    label: '기능 기획 상세',
    icon: 'settings',
    fields: [
      { id: 'fTrigger', label: '트리거 / 진입점',        type: 'text',     ph: '예) 강의 완료 팝업 or 마이페이지 버튼 클릭' },
      { id: 'fFlow',    label: '핵심 플로우 (단계 요약)', type: 'textarea', ph: '1. 사용자 액션\n2. 시스템 처리\n3. 결과 표시' },
      { id: 'fEdge',    label: '예외 / 엣지 케이스',     type: 'text',     ph: '예) 데이터 없을 시 안내 메시지 표출' },
      { id: 'fApi',     label: '연동 여부',              type: 'radio',    opts: ['없음', '내부 API', '외부 API', '미정'] },
    ],
  },
  '화면 기획': {
    label: '화면 기획 상세',
    icon: 'monitor',
    fields: [
      { id: 'scPage',   label: '대상 페이지 / 화면명', type: 'text',   ph: '예) 마이페이지 > 학습 현황' },
      { id: 'scLayout', label: '레이아웃 유형',        type: 'radio',  opts: ['단일 컬럼', '2단 분할', '대시보드', '리스트', '기타'] },
      { id: 'scDevice', label: '우선 기기',            type: 'radio',  opts: ['PC 우선', '모바일 우선', '동시 대응'] },
      { id: 'scNote',   label: 'UI 특이사항',          type: 'text',   ph: '예) 스크롤 시 헤더 고정, 무한 스크롤' },
      { id: 'scTarget', label: '대상',                 type: 'target' },
    ],
  },
  '콘텐츠 기획': {
    label: '콘텐츠 기획 상세',
    icon: 'file-text',
    fields: [
      { id: 'ctType',   label: '콘텐츠 유형',          type: 'radio', opts: ['영상', '텍스트', '퀴즈', '인터랙티브', '혼합'] },
      { id: 'ctLevel',  label: '난이도',               type: 'radio', opts: ['초급', '중급', '고급', '전체'] },
      { id: 'ctTone',   label: '톤 앤 매너',           type: 'text',  ph: '예) 친근하고 쉬운 설명, 초등 3~6학년 눈높이' },
      { id: 'ctVolume', label: '분량 / 업데이트 주기',  type: 'text',  ph: '예) 주 2편, 편당 5~8분 분량' },
    ],
  },
  '메뉴 기획': {
    label: '메뉴 기획 상세',
    icon: 'sitemap',
    fields: [
      { id: 'mDepth',  label: '메뉴 Depth / 경로', type: 'text',  ph: '예) GNB > 학습 > 강의목록 > 강의 상세' },
      { id: 'mLoc',    label: '위치',              type: 'radio', opts: ['GNB', 'LNB', '풋터', '마이페이지', '기타'] },
      { id: 'mAccess', label: '접근 권한',          type: 'radio', opts: ['전체 공개', '로그인 필요', '특정 역할만'] },
      { id: 'mDevice', label: '지원 기기',          type: 'radio', opts: ['PC', '모바일', '태블릿', '전체'] },
    ],
  },
}

export const PLANNING_TYPES = ['기능 기획', '화면 기획', '콘텐츠 기획', '메뉴 기획'] as const
export const TARGET_OPTIONS = ['#학교선생님', '#초등학생', '#중학생', '#고등학생'] as const

export const SYSTEM_PROMPT = `당신은 학교 교사 지원 에듀테크 서비스의 내부 기획 전문가입니다. 순수 JSON만 출력하세요. 외부 공개용 표현(비즈니스 모델, 수익 등) 사용 금지.

주의사항(cautions) 작성 규칙:
- 기획 내용과 대조하여 실제로 해당되는 것만 선별하세요. 없으면 반드시 빈 배열([])을 반환하세요.
- 각 항목: {"tag":"태그명","text":"내용"}

검토 기준:
1. 학생 개인정보(이름, 성적, 출결 등) 포함 → tag: "개인정보"
2. NEIS·학교 행정 시스템 등 외부 연동 필요 → tag: "시스템 연동"
3. 배포 시점이 학기 중·시험 기간에 영향 가능 → tag: "배포 타이밍"
4. 저사양 PC·구형 브라우저 환경 고려 필요 → tag: "환경 대응"
5. 교육부·교육청 가이드라인 준수 필요 → tag: "정책 준수"
6. 교사 업무 과부하를 가중시킬 수 있는 UX → tag: "UX 부담"
7. 학교·학급별 데이터 분리 필요 → tag: "데이터 격리"

JSON:
{"overview":"개요 2~3문장","background":"배경 2~3문장","type_detail":"유형 상세 3~5줄","features":["기능1","기능2","기능3","기능4","기능5"],"expected_effects":["효과1","효과2","효과3"],"schedule":[{"phase":"1단계","title":"기획·분석","period":"1~2주차","tasks":"요구사항 정의, 내부 검토"},{"phase":"2단계","title":"설계·디자인","period":"3~4주차","tasks":"와이어프레임, UI 설계, 내부 리뷰"},{"phase":"3단계","title":"개발","period":"5~8주차","tasks":"프론트·백엔드 개발, 연동"},{"phase":"4단계","title":"QA·배포","period":"9~10주차","tasks":"내부 QA, 스테이징 검증, 배포"}],"cautions":[]}`
