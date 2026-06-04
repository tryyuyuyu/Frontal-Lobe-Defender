import type { ChatMessage } from '../types'

// ============================================================
// DeepSeek API 配置 — 从 Vite .env 读取
// DeepSeek 完全兼容 OpenAI Chat Completions 协议
// ============================================================
const AI_API_URL = import.meta.env.VITE_AI_API_URL || ''
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || ''
const AI_MODEL    = import.meta.env.VITE_AI_MODEL || 'deepseek-chat'

// 启动时打印诊断信息（仅打印 Key 前后几位，保护隐私）
console.log('[AI] ======== 环境变量检查 ========')
console.log('[AI] VITE_AI_API_URL:', AI_API_URL || '❌ 未设置')
console.log('[AI] VITE_AI_API_KEY:', AI_API_KEY
  ? `${AI_API_KEY.slice(0, 8)}...${AI_API_KEY.slice(-4)}`
  : '❌ 未设置')
console.log('[AI] VITE_AI_MODEL:', AI_MODEL)
console.log('[AI] ==============================')

/** 认知重构的系统提示词 */
const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `你是一位温暖、专业的认知行为治疗助手，名叫"保卫前额叶"。
你的核心任务是对用户的烦恼进行"认知重构"（Cognitive Reframing）。

规则：
1. 字数严格控制在 60-100 字之间
2. 先共情，再提供一个温和的视角转换建议
3. 语气温柔但不啰嗦，像一位懂心理学的朋友
4. 如果用户的问题涉及严重心理危机，请温和建议寻求专业帮助
5. 使用中文回复`,
}

// ============================================================
// 工具：带超时的 fetch
// ============================================================
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    console.warn(`[AI] ⏰ ${timeoutMs / 1000}s 超时，主动中断`)
    controller.abort()
  }, timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

// ============================================================
// 核心：调用 DeepSeek API 获取认知重构建议
// 返回值保证是 string，永不 throw
// ============================================================
export async function getCognitiveReframe(userInput: string): Promise<string> {
  const messages: ChatMessage[] = [
    SYSTEM_PROMPT,
    { role: 'user', content: userInput },
  ]

  // 未配置 Key → 离线模式
  if (!AI_API_URL || !AI_API_KEY) {
    console.warn('[AI] ⚠️ 未配置 API Key / URL，使用离线 fallback')
    return getFallbackResponse()
  }

  const body = {
    model: AI_MODEL,
    messages,
    max_tokens: 200,
    temperature: 0.7,
  }

  console.log(
    `[AI] 📤 发起请求 → ${AI_API_URL}\n` +
    `[AI]    Model: ${AI_MODEL}\n` +
    `[AI]    Input: "${userInput.slice(0, 40)}..."\n` +
    `[AI]    Headers: Authorization=Bearer ${AI_API_KEY.slice(0, 8)}...`
  )

  try {
    const response = await fetchWithTimeout(
      AI_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify(body),
      },
      15_000
    )

    console.log(`[AI] 📥 响应状态: ${response.status} ${response.statusText}`)

    // HTTP 错误 —— 读响应体后 throw（由外层 catch 兜底）
    if (!response.ok) {
      let errorBody = ''
      try { errorBody = await response.text() } catch { /* ignore */ }
      console.error(`[AI] ❌ HTTP ${response.status} — 响应体:\n${errorBody.slice(0, 500)}`)
      throw new Error(`[API ${response.status}] ${errorBody.slice(0, 200)}`)
    }

    // 解析 JSON 体
    let data: unknown
    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('[AI] ❌ 响应 JSON 解析失败:', parseErr)
      throw new Error('Response is not valid JSON')
    }

    console.log('[AI] 🔍 原始响应结构:', JSON.stringify(data).slice(0, 300))

    // 提取 content（兼容多种响应格式）
    const content = extractContent(data)
    if (content) {
      console.log(`[AI] ✅ 成功 (${content.length} 字): "${content.slice(0, 50)}..."`)
      return content
    }

    // 响应格式不匹配
    console.error('[AI] ❌ 无法从响应中提取 content，完整响应:', JSON.stringify(data).slice(0, 500))
    throw new Error('Response missing choices[0].message.content')

  } catch (error) {
    // 区分错误类型，输出详细信息
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[AI] ❌ 请求超时 (15s) — 检查网络或 API 地址是否可达')
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[AI] ❌ 网络不可达 / CORS 被拒 — 检查 API URL 和网络连接')
      console.error('[AI]    原始错误:', error.message)
    } else if (error instanceof Error) {
      console.error('[AI] ❌ 请求异常:', error.message)
      console.error('[AI]    Stack:', error.stack?.split('\n').slice(0, 3).join('\n'))
    } else {
      console.error('[AI] ❌ 未知错误:', error)
    }

    console.warn('[AI] ⤵ 降级为离线 fallback')
    return getFallbackResponse()
  }
}

// ============================================================
// 从 API 响应中提取文本内容
// 兼容 DeepSeek / OpenAI / 其他兼容格式
// ============================================================
function extractContent(data: unknown): string | null {
  // 标准路径: data.choices[0].message.content
  try {
    const dataObj = data as Record<string, unknown>
    if (Array.isArray(dataObj.choices)) {
      const choice = dataObj.choices[0] as Record<string, unknown> | undefined
      const message = choice?.message as Record<string, unknown> | undefined
      const delta = choice?.delta as Record<string, unknown> | undefined
      const content = (message?.content || delta?.content) as string | undefined
      if (typeof content === 'string' && content.trim()) {
        return content.trim()
      }
    }
  } catch {
    // continue
  }

  // 备选路径: data.content (某些简化格式)
  try {
    const dataObj = data as Record<string, unknown>
    if (typeof dataObj.content === 'string' && dataObj.content.trim()) {
      return dataObj.content.trim()
    }
  } catch {
    // continue
  }

  return null
}

// ============================================================
// 离线 fallback —— API 不可用时的预设回复
// ============================================================
function getFallbackResponse(): string {
  const responses = [
    '我听到你了。那种"脑子里事情太多"的感觉确实让人喘不过气。试着把注意力拉回到此刻——你现在是安全的，一次只做一件事就够了。',
    '你的感受是真实的，不是"想太多"。前额叶在压力下确实会暂时"罢工"。给自己 3 分钟，深呼吸，让理性慢慢回来。',
    '拖延不是懒，是大脑在保护你。它觉得那个任务有"威胁"。试着把任务切到最小的一步——只做 2 分钟，就 2 分钟。',
    '你已经很棒了——在感到疲惫的时候还能主动寻求帮助，这本身就是前额叶在工作的证明。给自己一点温柔的肯定吧。',
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
