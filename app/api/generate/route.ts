import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/config'
import { GenerateRequest } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { planningType, isAdmin, projectName, purpose, features, targets, dynValues, imageAnalysis, attachUrls } = body

    const adminCtx = isAdmin
      ? '이 기획서는 사용자 페이지와 관리자 페이지를 동시에 기획합니다. 사용자 관점의 기능과 함께 관리자 운영·관리 관점도 함께 반영하세요.'
      : ''

    const systemPrompt = `${SYSTEM_PROMPT}\n${adminCtx}`

    const urlSection = attachUrls?.length
      ? '\n\n[참고 링크]\n' + attachUrls.map(r => r.url + (r.memo ? ` (${r.memo})` : '')).join('\n')
      : ''

    const userMessage = [
      `기획 유형: ${planningType}${isAdmin ? ' (관리자 페이지 동시 기획)' : ''}`,
      `프로젝트명: ${projectName}`,
      `목적: ${purpose}`,
      targets.length ? `대상: ${targets.join(', ')}` : '',
      `주요 기능: ${features}`,
      dynValues ? `유형별 상세:\n${dynValues}` : '',
      imageAnalysis ? `\n[첨부 화면 분석]\n${imageAnalysis}` : '',
      urlSection,
    ].filter(Boolean).join('\n')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const raw = response.content.find(b => b.type === 'text')?.text ?? ''
    const doc = JSON.parse(raw.replace(/```json|```/g, '').trim())

    return NextResponse.json({ doc })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '기획서 생성에 실패했습니다.' }, { status: 500 })
  }
}
