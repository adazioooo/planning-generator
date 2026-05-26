'use client'

import { useState } from 'react'
import { PlanningType, GeneratedDoc, AttachImage, AttachUrl } from '@/types'
import { DYN_CONFIG } from '@/lib/config'
import InputPanel from '@/components/InputPanel'
import DocOutput from '@/components/DocOutput'

export default function Home() {
  // 기획 유형 & 옵션
  const [planningType, setPlanningType] = useState<PlanningType>('기능 기획')
  const [isAdmin, setIsAdmin] = useState(false)

  // 기본 필드
  const [projectName, setProjectName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [features, setFeatures] = useState('')

  // 동적 필드
  const [dynTextValues, setDynTextValues] = useState<Record<string, string>>({})
  const [radioValues, setRadioValues] = useState<Record<string, Record<string, string>>>({})
  const [targets, setTargets] = useState<string[]>([])

  // 첨부
  const [attachMode, setAttachMode] = useState<'img' | 'url'>('img')
  const [attachImages, setAttachImages] = useState<AttachImage[]>([])
  const [attachUrls, setAttachUrls] = useState<AttachUrl[]>([{ url: '', memo: '' }])

  // 출력
  const [doc, setDoc] = useState<GeneratedDoc | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 저장용 — 출력에 전달
  const [outputMeta, setOutputMeta] = useState<{
    planningType: PlanningType
    isAdmin: boolean
    targets: string[]
    attachMode: 'img' | 'url'
    attachImages: AttachImage[]
    attachUrls: AttachUrl[]
  } | null>(null)

  const handleFieldChange = (key: string, val: string) => {
    if (key === 'projectName') setProjectName(val)
    else if (key === 'purpose') setPurpose(val)
    else if (key === 'features') setFeatures(val)
  }

  const handleDynTextChange = (id: string, val: string) => {
    setDynTextValues(prev => ({ ...prev, [id]: val }))
  }

  const handleRadioChange = (type: string, id: string, val: string) => {
    setRadioValues(prev => ({ ...prev, [type]: { ...prev[type], [id]: val } }))
  }

  const handleTargetToggle = (label: string) => {
    setTargets(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label])
  }

  const getDynValues = (): string => {
    const cfg = DYN_CONFIG[planningType]
    return cfg.fields
      .filter(f => f.type !== 'target')
      .map(f => {
        if (f.type === 'radio') {
          const v = radioValues[planningType]?.[f.id] ?? f.opts?.[0]
          return v ? `- ${f.label}: ${v}` : null
        } else {
          const v = dynTextValues[f.id]
          return v?.trim() ? `- ${f.label}: ${v.trim()}` : null
        }
      })
      .filter(Boolean)
      .join('\n')
  }

  const handleSubmit = async () => {
    if (!projectName.trim() || !purpose.trim() || !features.trim()) {
      setError('프로젝트명, 목적, 주요 기능은 필수 입력입니다.')
      return
    }
    if (planningType === '화면 기획' && !isAdmin && targets.length === 0) {
      setError('화면 기획 시 대상을 하나 이상 선택해주세요.')
      return
    }
    setError('')
    setLoading(true)
    setDoc(null)

    try {
      // 이미지 분석 (첨부 있을 때)
      let imageAnalysis = ''
      if (attachImages.length > 0) {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: attachImages }),
        })
        const data = await res.json()
        imageAnalysis = data.analysis ?? ''
      }

      // 기획서 생성
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planningType,
          isAdmin,
          projectName: projectName.trim(),
          purpose: purpose.trim(),
          features: features.trim(),
          targets: isAdmin ? [] : targets,
          dynValues: getDynValues(),
          imageAnalysis,
          attachUrls: attachMode === 'url' ? attachUrls.filter(r => r.url) : [],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setDoc(data.doc)
      setOutputMeta({
        planningType,
        isAdmin,
        targets: isAdmin ? [] : targets,
        attachMode,
        attachImages,
        attachUrls,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    const el = document.getElementById('doc-output')
    if (el) navigator.clipboard.writeText(el.innerText)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-blue-900 px-6 py-4 flex items-center gap-3 sticky top-0 z-50">
        <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">AI POWERED</span>
        <h1 className="text-white text-base font-bold tracking-tight">기획서 초안 생성기</h1>
        <span className="ml-auto text-white/50 text-xs hidden sm:block">내부 기획용 · Powered by Claude</span>
      </header>

      {/* 본문 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        {/* 입력 */}
        <InputPanel
          planningType={planningType}
          isAdmin={isAdmin}
          projectName={projectName}
          purpose={purpose}
          features={features}
          targets={targets}
          dynTextValues={dynTextValues}
          radioValues={radioValues}
          attachMode={attachMode}
          attachImages={attachImages}
          attachUrls={attachUrls}
          loading={loading}
          onTypeChange={t => { setPlanningType(t); setDoc(null) }}
          onAdminToggle={setIsAdmin}
          onFieldChange={handleFieldChange}
          onDynTextChange={handleDynTextChange}
          onRadioChange={handleRadioChange}
          onTargetToggle={handleTargetToggle}
          onAttachModeChange={setAttachMode}
          onImagesChange={setAttachImages}
          onUrlsChange={setAttachUrls}
          onSubmit={handleSubmit}
        />

        {/* 출력 */}
        <div className="p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              📄 기획서 출력
              <span className="flex-1 h-px bg-blue-100" />
            </div>
            {doc && (
              <button
                onClick={handleCopy}
                className="ml-auto text-xs font-semibold text-slate-500 border border-slate-200 bg-white
                  px-3 py-1 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-1"
              >
                📋 복사
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-80 gap-4">
              <div className="flex gap-2">
                {['bg-blue-900', 'bg-amber-400', 'bg-green-500'].map((c, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full ${c} animate-bounce`}
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">Claude가 기획서를 검토하고 있습니다...</p>
            </div>
          )}

          {!loading && !doc && !error && (
            <div className="flex flex-col items-center justify-center min-h-80 gap-3 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">📝</div>
              <h3 className="text-sm font-semibold text-slate-700">기획서가 여기에 표시됩니다</h3>
              <p className="text-xs text-slate-400 leading-relaxed">왼쪽에서 정보를 입력하고<br />생성 버튼을 눌러주세요.</p>
            </div>
          )}

          {!loading && doc && outputMeta && (
            <div id="doc-output">
              <DocOutput
                doc={doc}
                projectName={projectName}
                planningType={outputMeta.planningType}
                isAdmin={outputMeta.isAdmin}
                targets={outputMeta.targets}
                attachMode={outputMeta.attachMode}
                attachImages={outputMeta.attachImages}
                attachUrls={outputMeta.attachUrls}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
