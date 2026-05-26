'use client'

import { DYN_CONFIG, TARGET_OPTIONS } from '@/lib/config'
import { PlanningType } from '@/types'

interface Props {
  planningType: PlanningType
  values: Record<string, string>
  radioValues: Record<string, Record<string, string>>
  targets: string[]
  onChange: (id: string, value: string) => void
  onRadioChange: (type: string, id: string, value: string) => void
  onTargetToggle: (label: string) => void
}

export default function DynFields({
  planningType, values, radioValues, targets, onChange, onRadioChange, onTargetToggle,
}: Props) {
  const cfg = DYN_CONFIG[planningType]
  if (!cfg) return null

  return (
    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3 mb-3">
      <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2 flex items-center gap-1">
        ✦ {cfg.label}
      </div>

      {cfg.fields.map(f => (
        <div key={f.id} className="mb-2 last:mb-0">
          <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>

          {f.type === 'target' && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {TARGET_OPTIONS.map(lb => (
                <button
                  key={lb}
                  onClick={() => onTargetToggle(lb)}
                  className={`px-3 py-1 rounded-full border-2 text-xs font-semibold transition-all
                    ${targets.includes(lb)
                      ? 'border-blue-900 bg-blue-900 text-white'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                  {lb}
                </button>
              ))}
            </div>
          )}

          {f.type === 'radio' && f.opts && (
            <div className="flex flex-wrap gap-1">
              {f.opts.map(opt => {
                const current = radioValues[planningType]?.[f.id] ?? f.opts![0]
                return (
                  <button
                    key={opt}
                    onClick={() => onRadioChange(planningType, f.id, opt)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all
                      ${current === opt
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {f.type === 'textarea' && (
            <textarea
              rows={3}
              value={values[f.id] ?? ''}
              onChange={e => onChange(f.id, e.target.value)}
              placeholder={f.ph}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none resize-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          )}

          {f.type === 'text' && (
            <input
              type="text"
              value={values[f.id] ?? ''}
              onChange={e => onChange(f.id, e.target.value)}
              placeholder={f.ph}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          )}
        </div>
      ))}
    </div>
  )
}
