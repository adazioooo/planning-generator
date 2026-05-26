export type PlanningType = '기능 기획' | '화면 기획' | '콘텐츠 기획' | '메뉴 기획'

export type RadioFieldOption = string

export interface DynField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'radio' | 'target'
  ph?: string
  opts?: RadioFieldOption[]
}

export interface DynConfig {
  label: string
  icon: string
  fields: DynField[]
}

export interface AttachImage {
  dataUrl: string
  name: string
}

export interface AttachUrl {
  url: string
  memo: string
}

export type AttachData =
  | { mode: 'img'; items: AttachImage[] }
  | { mode: 'url'; items: AttachUrl[] }

export interface ScheduleItem {
  phase: string
  title: string
  period: string
  tasks: string
}

export interface CautionItem {
  tag: string
  text: string
}

export interface GeneratedDoc {
  overview: string
  background: string
  type_detail: string
  features: string[]
  expected_effects: string[]
  schedule: ScheduleItem[]
  cautions: CautionItem[]
}

export interface GenerateRequest {
  planningType: PlanningType
  isAdmin: boolean
  projectName: string
  purpose: string
  features: string
  targets: string[]
  dynValues: string
  attachMode?: 'img' | 'url'
  imageAnalysis?: string
  attachUrls?: AttachUrl[]
}
