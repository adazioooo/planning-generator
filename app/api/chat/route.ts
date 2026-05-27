import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// 한국어 응답을 강제하는 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 친절하고 유능한 AI 어시스턴트입니다.
반드시 한국어로만 답변하세요. 어떤 질문이든 한국어로 답변해야 합니다.
자연스럽고 이해하기 쉬운 한국어를 사용하세요.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    // 메시지 유효성 검사
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    // API 키 확인
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY가 설정되지 않았습니다.')
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // Anthropic 클라이언트 초기화 (요청 시점에 env 읽기)
    const client = new Anthropic({ apiKey })

    // Claude API 호출
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message.trim(),
        },
      ],
    })

    // 응답 텍스트 추출
    const reply = response.content.find((b) => b.type === 'text')?.text ?? ''

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Claude API 오류:', error)
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
