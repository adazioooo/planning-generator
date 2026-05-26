'use client'

import { GeneratedDoc, PlanningType, AttachImage, AttachUrl } from '@/types'

const TYPE_ICONS: Record<string, string> = {
  '기능 기획': '⚙️',
  '화면 기획': '🖥️',
  '콘텐츠 기획': '📄',
  '메뉴 기획': '🗂️',
}

interface Props {
  doc: GeneratedDoc
  projectName: string
  planningType: PlanningType
  isAdmin: boolean
  targets: string[]
  attachMode?: 'img' | 'url'
  attachImages?: AttachImage[]
  attachUrls?: AttachUrl[]
}

export default function DocOutput({
  doc, projectName, planningType, isAdmin, targets,
  attachMode, attachImages, attachUrls,
}: Props) {
  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="bg-blue-900 px-5 py-4 text-white">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {TYPE_ICONS[planningType]} {planningType}
          </span>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 bg-purple-400/30 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              🛡 관리자 동시 기획
            </span>
          )}
        </div>
        <div className="text-lg font-bold mb-1">{projectName}</div>
        <div className="text-xs text-white/60">작성일: {now} · 내부 기획서 초안</div>
        {targets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {targets.map(t => (
              <span key={t} className="bg-white/15 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-5 space-y-5">
        <Section num={1} title="프로젝트 개요"><p className="text-sm text-slate-700 leading-relaxed">{doc.overview}</p></Section>
        <Section num={2} title="기획 배경"><p className="text-sm text-slate-700 leading-relaxed">{doc.background}</p></Section>
        <Section num={3} title={`${planningType} 상세`}><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{doc.type_detail}</p></Section>

        {/* 화면 기획 첨부 */}
        {attachMode === 'img' && attachImages && attachImages.length > 0 && (
          <Section num="📎" title="화면 기획 첨부" numColor="bg-purple-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {attachImages.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.dataUrl} alt={img.name} className="w-full" />
                </div>
              ))}
            </div>
          </Section>
        )}
        {attachMode === 'url' && attachUrls && attachUrls.filter(r => r.url).length > 0 && (
          <Section num="🔗" title="화면 기획 참고 링크" numColor="bg-purple-700">
            <div className="space-y-1.5 mt-2">
              {attachUrls.filter(r => r.url).map((r, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-xs">
                  <span className="text-blue-700">🔗</span>
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold flex-1 truncate hover:underline">{r.url}</a>
                  {r.memo && <span className="text-slate-500 whitespace-nowrap">{r.memo}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section num={4} title="주요 기능">
          <ul className="list-disc list-inside space-y-1">
            {doc.features.map((f, i) => <li key={i} className="text-sm text-slate-700">{f}</li>)}
          </ul>
        </Section>

        <Section num={5} title="기대 효과">
          <div className="space-y-2">
            {doc.expected_effects.map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-slate-700 leading-relaxed">{e}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section num={6} title="추진 일정">
          <div className="overflow-x-auto rounded-xl border border-slate-200 mt-1">
            <table className="w-full border-collapse text-xs min-w-[300px]">
              <thead>
                <tr className="bg-blue-50">
                  {['단계', '구분', '기간', '주요 태스크'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-bold text-blue-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doc.schedule.map((s, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-bold text-blue-700 whitespace-nowrap">{s.phase}</td>
                    <td className="px-3 py-2 font-semibold">{s.title}</td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{s.period}</td>
                    <td className="px-3 py-2 text-slate-500">{s.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 주의사항 — 있을 때만 */}
        {doc.cautions.length > 0 && (
          <div className="mb-0">
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-blue-50">
              <div className="w-5 h-5 rounded-md bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">!</div>
              <span className="text-sm font-bold">기획 검토 시 주의사항</span>
              <span className="ml-auto text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{doc.cautions.length}건 감지</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
              {doc.cautions.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  <div className="text-sm text-amber-900 leading-relaxed">
                    <span className="inline-block bg-amber-200 text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded mr-1.5">{c.tag}</span>
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  num, title, children, numColor = 'bg-blue-900',
}: {
  num: number | string
  title: string
  children: React.ReactNode
  numColor?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-blue-50">
        <div className={`w-5 h-5 rounded-md ${numColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
          {num}
        </div>
        <span className="text-sm font-bold">{title}</span>
      </div>
      {children}
    </div>
  )
}
