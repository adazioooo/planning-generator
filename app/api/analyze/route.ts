import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    // 요청 시점에 클라이언트 초기화 (환경변수 안정적으로 읽기)
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const { images }: { images: { dataUrl: string; name: string }[] } = await req.json()

    const imgContents: Anthropic.MessageParam['content'] = images.map(img => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: 'image/png' as const,
        data: img.dataUrl.split(',')[1],
      },
    }))

    imgContents.push({
      type: 'text',
      text: '위 화면 기획 이미지들을 분석해서, 각 이미지의 화면 구조·레이아웃·주요 UI 컴포넌트를 간략히 설명해주세요. 각 이미지는 번호로 구분해주세요.',
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: imgContents }],
    })

    const text = response.content.find(b => b.type === 'text')?.text ?? ''
    return NextResponse.json({ analysis: text })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '이미지 분석에 실패했습니다.' }, { status: 500 })
  }
}
