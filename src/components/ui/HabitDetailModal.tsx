import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, CheckCircle2, Lightbulb, Target } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { Habit } from '../../types'

// ============================================================
// 动态图标
// ============================================================
function getIcon(iconName: string, size = 24) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as Record<string, any>
  const Icon = icons[iconName]
  if (Icon) return <Icon size={size} />
  return <Brain size={size} />
}

// ============================================================
// 分类元数据
// ============================================================
const CATEGORY_LABELS: Record<string, string> = {
  life: '生活',
  diet: '饮食',
  sleep: '睡眠',
}

// ============================================================
// HabitDetailModal — 居中弹出式习惯详情对话框
// ============================================================
interface HabitDetailModalProps {
  habit: Habit | null
  onClose: () => void
}

export default function HabitDetailModal({ habit, onClose }: HabitDetailModalProps) {
  if (!habit) return null

  return (
    <AnimatePresence>
      {habit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 半透明遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 居中弹出卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl bg-white px-5 py-5 shadow-2xl"
          >
            {/* 头部 */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-600">
                  {getIcon(habit.icon, 24)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-warm-800">{habit.name}</h2>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-600">
                      {CATEGORY_LABELS[habit.category] || habit.category}
                    </span>
                    <span className="text-xs text-warm-400">🔥 {habit.streak} 天</span>
                    <span className="text-xs text-warm-300">·</span>
                    <span className={`text-xs font-medium ${habit.active ? 'text-sage-500' : 'text-warm-400'}`}>
                      {habit.active ? '已激活' : '未激活'}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-warm-400 hover:bg-warm-200"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* 一句话描述 */}
            <div className="mb-5 rounded-2xl bg-warm-50/80 px-4 py-3">
              <p className="text-sm leading-relaxed text-warm-700">{habit.description}</p>
            </div>

            {/* 详细做法 + 护脑原理 */}
            {habit.habitDetails && (
              <div className="space-y-5">
                {/* 详细做法 */}
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sage-700">
                    <CheckCircle2 size={16} className="text-sage-500" />
                    详细做法
                  </h3>
                  <div className="space-y-2">
                    {habit.habitDetails.steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        className="flex items-start gap-3 rounded-xl bg-sage-50/70 px-4 py-3"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-300 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-sage-800">{step}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* 具体案例提示 */}
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-warm-200 bg-warm-50/50 px-3 py-2.5">
                    <Lightbulb size={14} className="mt-0.5 shrink-0 text-warm-500" />
                    <p className="text-xs leading-relaxed text-warm-600">
                      <span className="font-medium">小贴士：</span>
                      刚开始不需要完美执行每一步。选 1-2 步最容易做到的开始，习惯建立后再逐步增加。
                    </p>
                  </div>
                </section>

                {/* 护脑原理 */}
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-700">
                    <Brain size={16} className="text-warm-500" />
                    护脑原理
                  </h3>
                  <div className="rounded-xl border border-warm-200 bg-gradient-to-br from-warm-50/80 to-sage-50/50 px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-warm-700">
                      {habit.habitDetails.brainBenefit}
                    </p>
                  </div>
                </section>

                {/* 预期效果 */}
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sage-700">
                    <Target size={16} className="text-sage-500" />
                    坚持效果
                  </h3>
                  <div className="rounded-xl bg-sage-50/50 px-4 py-3">
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-xs text-sage-700">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                        连续 3 天：前额叶开始建立新的神经通路连接
                      </li>
                      <li className="flex items-start gap-2 text-xs text-sage-700">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                        连续 7 天：行为开始自动化，认知负荷显著降低
                      </li>
                      <li className="flex items-start gap-2 text-xs text-sage-700">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                        连续 21 天：基底神经节接管习惯循环，完成"自动驾驶"升级
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {/* 没有 habitDetails 时的占位 */}
            {!habit.habitDetails && (
              <div className="rounded-xl border border-dashed border-warm-200 p-6 text-center">
                <p className="text-sm text-warm-400">暂无详细说明</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
