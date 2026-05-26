import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '기획서 초안 생성기',
  description: '학교 교사 지원 서비스 내부 기획용 AI 기획서 생성기',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
