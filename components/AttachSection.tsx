'use client'

import { useRef, useState } from 'react'
import { AttachImage, AttachUrl } from '@/types'

interface Props {
  images: AttachImage[]
  urls: AttachUrl[]
  mode: 'img' | 'url'
  onModeChange: (m: 'img' | 'url') => void
  onImagesChange: (imgs: AttachImage[]) => void
  onUrlsChange: (urls: AttachUrl[]) => void
}

export default function AttachSection({ images, urls, mode, onModeChange, onImagesChange, onUrlsChange }: Props) {
  const [open, setOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        onImagesChange([...images, { dataUrl: e.target?.result as string, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (i: number) => {
    const next = [...images]; next.splice(i, 1); onImagesChange(next)
  }

  const addUrl = () => onUrlsChange([...urls, { url: '', memo: '' }])
  const updateUrl = (i: number, key: 'url' | 'memo', val: string) => {
    const next = [...urls]; next[i] = { ...next[i], [key]: val }; onUrlsChange(next)
  }
  const removeUrl = (i: number) => {
    const next = [...urls]; next.splice(i, 1); onUrlsChange(next)
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={open}
          onChange={e => setOpen(e.target.checked)}
          className="w-4 h-4 accent-blue-900 cursor-pointer"
        />
        <span className="text-sm font-semibold text-slate-600">
          <span className="text-slate-800">화면 기획 첨부</span> · 레퍼런스나 와이어프레임을 추가할 수 있어요
        </span>
      </label>

      {open && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          {/* 탭 */}
          <div className="flex gap-1.5 mb-3">
            {(['img', 'url'] as const).map(m => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all
                  ${mode === m ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
              >
                {m === 'img' ? '🖼 이미지 업로드' : '🔗 URL / 피그마 링크'}
              </button>
            ))}
          </div>

          {mode === 'img' && (
            <>
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
                  ${images.length > 0 ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
                <div className="text-2xl mb-1">{images.length > 0 ? '✅' : '☁️'}</div>
                <div className="text-xs text-slate-500">
                  {images.length > 0 ? `${images.length}개 이미지 첨부됨` : '클릭하거나 이미지를 드래그하세요'}
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {mode === 'url' && (
            <div className="space-y-1.5">
              {urls.map((row, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={row.url}
                    onChange={e => updateUrl(i, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={row.memo}
                    onChange={e => updateUrl(i, 'memo', e.target.value)}
                    placeholder="메모"
                    className="w-20 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeUrl(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                  >✕</button>
                </div>
              ))}
              <button
                onClick={addUrl}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-1"
              >+ 링크 추가</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
