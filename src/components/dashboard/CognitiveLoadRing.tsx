import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useStore } from '../../store/useStore'

// ============================================================
// CognitiveLoadBar — 认知负荷横向进度条
// 替代原 SVG 圆环，用 spring 动画驱动宽度变化
// ============================================================
export default function CognitiveLoadBar() {
  const activeHabits = useStore((s) => s.habits.filter((h) => h.active))
  const getTodayProgress = useStore((s) => s.getTodayProgress)
  const getCompletedCount = useStore((s) => s.getCompletedCount)

  const progress = getTodayProgress()
  const completed = getCompletedCount()
  const total = activeHabits.length

  // spring 动画驱动进度
  const springProgress = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  })
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    springProgress.set(progress)
  }, [progress, springProgress])

  useEffect(() => {
    const unsubscribe = springProgress.on('change', (v) => {
      setDisplayProgress(Math.round(v))
    })
    return unsubscribe
  }, [springProgress])

  // 进度 → 颜色 + 宽度
  const barColor = useTransform(
    springProgress,
    [0, 40, 70, 100],
    ['#e3c18a', '#d4a76a', '#90b37a', '#7a9f62']
  )

  const barWidth = useTransform(springProgress, [0, 100], ['0%', '100%'])

  return (
    <div className="w-full space-y-3">
      {/* 顶部数值行 */}
      <div className="flex items-end justify-between">
        <div>
          <motion.span
            key={displayProgress}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-4xl font-bold text-sage-600"
          >
            {displayProgress}%
          </motion.span>
          <span className="ml-2 text-xs text-warm-400">
            认知负荷已卸载
          </span>
        </div>
        <span className="text-sm font-medium text-warm-500">
          {completed}/{total} 项
        </span>
      </div>

      {/* 进度条轨道 */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-warm-100">
        {/* 背景刻度纹路 */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: total || 1 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-warm-50 last:border-r-0"
            />
          ))}
        </div>

        {/* 动画进度填充 */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: barWidth,
            backgroundColor: barColor,
          }}
        />

        {/* 高光条 */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white/20"
          style={{ width: barWidth }}
        />
      </div>

      {/* 底部状态文字 */}
      <motion.p
        className="text-sm text-warm-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {progress === 0 && '今天还没有打卡哦，从一个小习惯开始吧 🌱'}
        {progress > 0 && progress < 50 && '好的开始！继续前进 🚶'}
        {progress >= 50 && progress < 100 && '过半啦，保持节奏 ✨'}
        {progress === 100 && '太棒了！今天的前额叶得到了很好的照顾 🧠'}
      </motion.p>

      {/* 激活习惯徽章 */}
      {total > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage-400" />
          <span className="text-xs text-sage-500">
            {total} 个习惯激活中
            {total >= 3 && '（已达上限）'}
          </span>
        </div>
      )}
    </div>
  )
}
