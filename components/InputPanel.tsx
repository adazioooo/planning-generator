'use client'

import { PlanningType, AttachImage, AttachUrl } from '@/types'
import { DYN_CONFIG } from '@/lib/config'
import TypeSelector from './TypeSelector'
import DynFields from './DynFields'
import AttachSection from './AttachSection'

interface Props {
  planningType: PlanningType
  isAdmin: boolean
  projectName: string
  purpose: string
  features: string
  targets: string[]
  dynTextValues: Record<string, string>
  radioValues: Record<string, Record<string, string>>
  attachMode: 'img' | 'url'
  attachImages: AttachImage[]
  attachUrls: AttachUrl[]
  loading: boolean
  onTypeChange: (t: PlanningType) => void
  onAdminToggle: (v: boolean) => void
  onFieldChange: (key: string, val: string) => void
  onDynTextChange: (id: string, val: string) => void
  onRadioChange: (type: string, id: string, val: string) => void
  onTargetToggle: (label: string) => void
  onAttachModeChange: (m: 'img' | 'url') => void
  onImagesChange: (imgs: AttachImage[]) => void
  onUrlsChange: (urls: AttachUrl[]) => void
  onSubmit: () => void
}

export default function InputPanel({
  planningType, isAdmin, projectName, purpose, features,
  targets, dynTextValues, radioValues,
  attachMode, attachImages, attachUrls,
  loading,
  onTypeChange, onAdminToggle, onFieldChange,
  onDynTextChange, onRadioChange, onTargetToggle,
  onAttachModeChange, onImagesChange, onUrlsChange,
  onSubmit,
}: Props) {
  return (
    <div className="p-5 bg-white overflow-y-auto">
      <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-4">
        ✏️ 입력 정보
        <span className="flex-1 h-px bg-blue-100" />
      </div>

      <TypeSelector
        selected={planningType}
        isAdmin={isAdmin}
        onSelect={onTypeChange}
        onAdminToggle={onAdminToggle}
      />

      {/* 프로젝트명 */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          📁 프로젝트명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={projectName}
          onChange={e => onFieldChange('projectName', e.target.value)}
          placeholder="예) 학습 현황 대시보드 개선"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* 목적 */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          🎯 목적 <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={purpose}
          onChange={e => onFieldChange('purpose', e.target.value)}
          placeholder="예) 학습자의 진도·성취도를 한눈에 파악해 학습 지속률 향상"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none resize-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
        />
      </div>

      {/* 주요 기능 */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          ✅ 주요 기능 / 요구사항 <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={features}
          onChange={e => onFieldChange('features', e.target.value)}
          placeholder={'예)\n- 학습 진도 시각화\n- 오답 노트 자동 생성\n- 알림 연동'}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none resize-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
        />
      </div>

      {/* 동적 필드 */}
      <DynFields
        planningType={planningType}
        values={dynTextValues}
        radioValues={radioValues}
        targets={targets}
        onChange={onDynTextChange}
        onRadioChange={onRadioChange}
        onTargetToggle={onTargetToggle}
      />

      {/* 화면 기획 첨부 */}
      <AttachSection
        images={attachImages}
        urls={attachUrls}
        mode={attachMode}
        onModeChange={onAttachModeChange}
        onImagesChange={onImagesChange}
        onUrlsChange={onUrlsChange}
      />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 bg-blue-900 text-white rounded-xl text-sm font-bold
          hover:bg-blue-950 active:scale-[0.99] disabled:bg-slate-400
          disabled:cursor-not-allowed transition-all shadow-md shadow-blue-900/30
          flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span> 생성 중...
          </>
        ) : (
          <>✨ 기획서 초안 생성</>
        )}
      </button>
    </div>
  )
}
