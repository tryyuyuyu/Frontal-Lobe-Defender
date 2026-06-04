import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react'
import { getCognitiveReframe } from '../lib/ai'
import { useStore } from '../store/useStore'

// ============================================================
// 工具：最小等待时间
// ============================================================
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================
// EmotionBin — 情绪垃圾桶
// 输入烦恼 → AI 认知重构（最小 1.8s 加载，确保认知缓冲）
// ============================================================
export default function EmotionBin() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const addEmotionEntry = useStore((s) => s.addEmotionEntry)

  const handleSubmit = async () => {
    if (!input.trim() || loading) return

    // 重置状态：清空旧回复和旧错误，进入 loading
    setResponse('')
    setError('')
    setLoading(true)

    try {
      // Promise.all 强制最小等待 1.8s ——
      // 即使 getCognitiveReframe 本地 fallback 瞬间返回也会等待
      const [aiText] = await Promise.all([
        getCognitiveReframe(input.trim()),
        delay(1800),
      ])

      setResponse(aiText)

      // 存到历史记录
      addEmotionEntry({
        content: input.trim(),
        aiResponse: aiText,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('情绪垃圾桶请求失败:', msg, err)
      setError(`请求异常：${msg}`)
    } finally {
      // finally 确保 loading 在任何情况下都被清除 ——
      // 即使 API 报错 / 超时，转圈动画一定会停止
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* 头部 */}
      <header>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium uppercase tracking-wider text-sage-500"
        >
          Emotion Bin
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-1 text-2xl font-bold text-warm-800"
        >
          情绪垃圾桶
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-1 text-sm text-warm-500"
        >
          写下烦恼，让 AI 帮你重新看待它
        </motion.p>
      </header>

      {/* 输入区 */}
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="现在脑子里在想什么？写下来，就轻松了..."
          rows={4}
          className="w-full resize-none rounded-2xl border border-warm-200 bg-white/60 p-4 text-sm text-warm-800 placeholder-warm-300 backdrop-blur-sm transition-all focus:border-sage-300 focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-sage-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sage-500/20 transition-all hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              深度思考中...
            </>
          ) : (
            <>
              <Send size={18} />
              倾倒烦恼
            </>
          )}
        </motion.button>
      </div>

      {/* Loading 动画 — 认知缓冲体验 */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-8"
        >
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-sage-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <p className="text-xs text-warm-400">
            AI 正在帮你重新梳理思绪...
          </p>
        </motion.div>
      )}

      {/* 错误提示 */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-4"
        >
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* AI 回复区 */}
      {response && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="rounded-2xl border border-sage-200 bg-sage-50/60 p-5 backdrop-blur-sm"
        >
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-sage-500" />
            <span className="text-xs font-medium text-sage-600">认知重构</span>
          </div>
          <p className="text-sm leading-relaxed text-warm-700">{response}</p>
        </motion.div>
      )}

      {/* 空状态提示 */}
      {!response && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-warm-300 p-8 text-center">
          <Sparkles size={32} className="mx-auto mb-2 text-warm-300" />
          <p className="text-sm text-warm-400">
            前额叶有时会"过载"——把烦恼写下来，就能释放认知资源
          </p>
        </div>
      )}
    </motion.div>
  )
}
