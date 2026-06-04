import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Moon, Sun, History, MessageCircle,
  Sparkles, Quote, ChevronDown, Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'

// ============================================================
// Profile — 我的页面
// 积极心理暗示：优先展示 AI 宽慰建议 + 随机语录 + 微信登录占位
// ============================================================
export default function Profile() {
  const settings = useStore((s) => s.settings)
  const emotionHistory = useStore((s) => s.emotionHistory)
  const updateSettings = useStore((s) => s.updateSettings)
  const habits = useStore((s) => s.habits)
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)

  // 随机挑选一条 AI 宽慰语录（每次渲染随机，useMemo 保证同次渲染稳定）
  const randomQuote = useMemo(() => {
    if (emotionHistory.length === 0) return null
    const idx = Math.floor(Math.random() * emotionHistory.length)
    return emotionHistory[idx]
  }, [emotionHistory])

  const handleWechatLogin = () => {
    toast.info('登录功能暂未开放，当前已为您开启本地数据守护模式', {
      description: '所有数据安全存储在您的设备中',
      duration: 3000,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ========== 头部 ========== */}
      <header>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium uppercase tracking-wider text-sage-500"
        >
          Profile
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-1 text-2xl font-bold text-warm-800"
        >
          我的
        </motion.h1>
      </header>

      {/* ========== 统计卡片 ========== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-2xl border border-sage-200 bg-sage-50/60 p-4 backdrop-blur-sm">
          <p className="text-xs text-sage-500">累计坚持</p>
          <p className="mt-1 text-3xl font-bold text-sage-600">{totalStreak}</p>
          <p className="text-xs text-sage-400">天</p>
        </div>
        <div className="rounded-2xl border border-warm-200 bg-warm-50/60 p-4 backdrop-blur-sm">
          <p className="text-xs text-warm-500">认知重构</p>
          <p className="mt-1 text-3xl font-bold text-warm-600">{emotionHistory.length}</p>
          <p className="text-xs text-warm-400">次</p>
        </div>
      </motion.div>

      {/* ========== 今日随机宽慰 ========== */}
      {randomQuote && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-700">
            <Quote size={16} className="text-sage-500" />
            今日宽慰
          </h2>
          <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50/80 to-warm-50/80 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-200">
                <Sparkles size={14} className="text-sage-600" />
              </div>
              <span className="text-xs font-medium text-sage-600">
                守护者的宽慰 · {new Date(randomQuote.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-sage-800">
              {randomQuote.aiResponse}
            </p>
            <p className="mt-2 text-xs text-warm-400 line-clamp-1">
              当时的烦恼：{randomQuote.content}
            </p>
          </div>
        </motion.section>
      )}

      {/* ========== 账户与同步 ========== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-700">
          <Shield size={16} className="text-warm-500" />
          账户与同步
        </h2>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWechatLogin}
          className="flex w-full items-center gap-4 rounded-2xl border border-green-200
                     bg-gradient-to-r from-green-50/80 to-emerald-50/80
                     p-4 text-left backdrop-blur-sm
                     transition-shadow hover:shadow-md"
        >
          {/* 微信图标 */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500">
            <MessageCircle size={20} className="text-white" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">微信登录</p>
            <p className="mt-0.5 text-xs text-green-600/70">
              登录后可跨设备同步数据 · 当前为本地守护模式
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-medium text-green-700">
            暂未开放
          </span>
        </motion.button>

        <p className="mt-2 text-center text-[10px] text-warm-300">
          不登录也不影响使用，所有数据仅存储在您的设备中 🔒
        </p>
      </motion.section>

      {/* ========== 提醒设置 ========== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-700">
          <Bell size={16} className="text-warm-500" />
          提醒设置
        </h2>

        <div className="space-y-2">
          {/* 早八提醒 */}
          <div className="flex items-center justify-between rounded-xl border border-warm-100 bg-white/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100">
                <Sun size={16} className="text-warm-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-800">早八提醒</p>
                <p className="text-xs text-warm-400">早上 8:00 启动习惯检查</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ morningReminder: !settings.morningReminder })}
              className={`
                relative h-7 w-12 rounded-full transition-colors
                ${settings.morningReminder ? 'bg-sage-400' : 'bg-warm-200'}
              `}
            >
              <motion.div
                animate={{ x: settings.morningReminder ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
              />
            </motion.button>
          </div>

          {/* 晚九提醒 */}
          <div className="flex items-center justify-between rounded-xl border border-warm-100 bg-white/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
                <Moon size={16} className="text-sage-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-800">晚九提醒</p>
                <p className="text-xs text-warm-400">晚上 9:00 提醒放松休息</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ eveningReminder: !settings.eveningReminder })}
              className={`
                relative h-7 w-12 rounded-full transition-colors
                ${settings.eveningReminder ? 'bg-sage-400' : 'bg-warm-200'}
              `}
            >
              <motion.div
                animate={{ x: settings.eveningReminder ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
              />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ========== 守护者的宽慰 — 认知重构记录 ========== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-700">
          <History size={16} className="text-warm-500" />
          守护者的宽慰
        </h2>

        {emotionHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-warm-200 p-6 text-center">
            <MessageCircle size={24} className="mx-auto mb-2 text-warm-300" />
            <p className="text-sm text-warm-400">使用情绪垃圾桶后，AI 的温暖宽慰会出现在这里</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {emotionHistory.map((entry) => (
              <ReframeCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  )
}

// ============================================================
// ReframeCard — 单条认知重构记录
// 优先展示 AI 宽慰建议，烦恼原文折叠为次要信息
// ============================================================
function ReframeCard({ entry }: { entry: { id: string; content: string; aiResponse: string; createdAt: string } }) {
  return (
    <motion.details
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-sage-100 bg-white/70 backdrop-blur-sm
                 transition-shadow hover:shadow-sm"
    >
      {/* 摘要行 — AI 宽慰高亮展示 */}
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 select-none">
        {/* 图标 */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sage-100">
          <Sparkles size={14} className="text-sage-500" />
        </div>

        {/* AI 宽慰为主 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-sage-800 line-clamp-2">
            {entry.aiResponse}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-warm-400">
              {new Date(entry.createdAt).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="text-[10px] text-warm-300">·</span>
            <span className="text-[10px] text-warm-400">点击展开</span>
          </div>
        </div>

        {/* 展开指示箭头 */}
        <ChevronDown
          size={14}
          className="mt-1 shrink-0 text-warm-300 transition-transform duration-200
                     group-open:rotate-180"
        />
      </summary>

      {/* 展开详情 — 原始烦恼 */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-4 mb-4 rounded-xl border border-dashed border-warm-200 bg-warm-50/50 px-4 py-3">
            <p className="text-[10px] font-medium text-warm-400 mb-1">当时的烦恼</p>
            <p className="text-xs leading-relaxed text-warm-600">{entry.content}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.details>
  )
}
