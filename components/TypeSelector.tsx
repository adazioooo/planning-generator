'use client'

import { PlanningType } from '@/types'
import { PLANNING_TYPES } from '@/lib/config'

const TYPE_ICONS: Record<string, string> = {
  '기능 기획':   '⚙️',
  '화면 기획':   '🖥️',
  '콘텐츠 기획': '📄',
  '메뉴 기획':   '🗂️',
}

interface Props {
  selected: PlanningType
  isAdmin: boolean
  onSelect: (type: PlanningType) => void
  onAdminToggle: (v: boolean) => void
}

export default function TypeSelector({ selected, isAdmin, onSelect, onAdminToggle }: Props) {
  return (
    <div className="mb-3">
      {/* 라벨 + 관리자 토글 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
          🔲 기획 유형 <span className="text-red-500">*</span>
        </span>
        <label
          className={`ml-auto flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all select-none
            ${isAdmin
              ? 'border-purple-400 bg-purple-50 text-purple-700'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-purple-300'}`}
        >
          {/* 토글 스위치 */}
          <span
            onClick={() => onAdminToggle(!isAdmin)}
            className={`relative inline-flex w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0
              ${isAdmin ? 'bg-purple-500' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200
              ${isAdmin ? 'translate-x-4' : 'translate-x-0'}`} />
          </span>
          관리자 페이지 동시 기획 필요
        </label>
      </div>

      {/* 유형 버튼 그리드 */}
      <div className="grid grid-cols-2 gap-1.5">
        {PLANNING_TYPES.map(type => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold text-left transition-all
              ${selected === type
                ? 'border-blue-900 bg-blue-900 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <span>{TYPE_ICONS[type]}</span>
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
