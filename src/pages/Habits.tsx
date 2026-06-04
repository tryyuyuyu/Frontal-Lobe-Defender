import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout, UtensilsCrossed, Bed, Plus, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import type { HabitCategory, CategoryMeta, Habit } from '../types'
import { useStore } from '../store/useStore'
import HabitDetailModal from '../components/ui/HabitDetailModal'

// ============================================================
// 分类元数据
// ============================================================
const CATEGORIES: CategoryMeta[] = [
  { key: 'life',  label: '生活', icon: 'Sprout',          color: 'bg-sage-100 text-sage-600 border-sage-200' },
  { key: 'diet',  label: '饮食', icon: 'UtensilsCrossed', color: 'bg-warm-100 text-warm-600 border-warm-200' },
  { key: 'sleep', label: '睡眠', icon: 'Bed',             color: 'bg-sage-50 text-sage-500 border-sage-100' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
  Sprout,
  UtensilsCrossed,
  Bed,
}

// ============================================================
// Habits — 习惯池页面
// 按分类展示所有习惯，支持激活/停用（上限 3 个）
// ============================================================
export default function Habits() {
  const habits = useStore((s) => s.habits)
  const toggleActive = useStore((s) => s.toggleActive)
  const getActiveCount = useStore((s) => s.getActiveCount)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const getHabitsByCategory = (category: HabitCategory) =>
    habits.filter((h) => h.category === category)

  const handleToggleActive = (id: string) => {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return

    // 如果要激活且已达上限
    if (!habit.active && getActiveCount() >= 3) {
      toast.warning('最多只能同时专注于 3 个习惯', {
        description: '请先停用一个已激活的习惯，再激活新的',
        duration: 3000,
      })
      return
    }

    const success = toggleActive(id)
    if (success && habit.active) {
      toast.success('已停用习惯', { duration: 1500 })
    } else if (success && !habit.active) {
      toast.success('已激活习惯 ✨', {
        description: `"${habit.name}" 已加入今日仪表盘`,
        duration: 2000,
      })
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
      <header className="flex items-center justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium uppercase tracking-wider text-sage-500"
          >
            Habit Pool
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-1 text-2xl font-bold text-warm-800"
          >
            习惯库
          </motion.h1>
        </div>

        <div className="flex items-center gap-2">
          {/* 激活计数 */}
          <span className="text-xs font-medium text-sage-600">
            {getActiveCount()}/3 已激活
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 rounded-full bg-sage-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sage-500/20 transition-colors hover:bg-sage-600"
          >
            <Plus size={14} />
            新建
          </motion.button>
        </div>
      </header>

      {/* 按分类展示 */}
      <div className="space-y-5">
        {CATEGORIES.map((cat, idx) => {
          const IconComp = ICON_MAP[cat.icon]
          const catHabits = getHabitsByCategory(cat.key)

          return (
            <motion.section
              key={cat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
            >
              {/* 分类标题 */}
              <div className="mb-2 flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${cat.color}`}>
                  {IconComp && <IconComp size={14} />}
                </div>
                <h2 className="text-sm font-semibold text-warm-700">{cat.label}</h2>
                <span className="text-xs text-warm-400">({catHabits.length})</span>
              </div>

              {/* 习惯列表 */}
              {catHabits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-warm-200 p-4 text-center">
                  <p className="text-xs text-warm-400">暂无{cat.label}类习惯</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {catHabits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 rounded-xl border p-3 backdrop-blur-sm
                        transition-all duration-200
                        ${habit.active
                          ? 'border-sage-200 bg-sage-50/40 shadow-sm'
                          : 'border-warm-100 bg-white/60 hover:bg-white/90'
                        }
                      `}
                    >
                      {/* 内容区 — 点击查看详情 */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => setSelectedHabit(habit)}
                      >
                        <div className="flex items-center gap-2">
                          <h3 className={`
                            text-sm font-medium
                            ${habit.active ? 'text-sage-700' : 'text-warm-800'}
                          `}>
                            {habit.name}
                          </h3>
                          {habit.active && (
                            <span className="shrink-0 rounded-full bg-sage-100 px-1.5 py-0.5 text-[10px] font-medium text-sage-600">
                              已激活
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-warm-400 truncate">{habit.description}</p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-warm-500">
                          🔥 {habit.streak}天
                        </div>
                      </div>

                      {/* 激活开关 */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleToggleActive(habit.id)}
                        className="shrink-0"
                        aria-label={habit.active ? '停用习惯' : '激活习惯'}
                      >
                        {habit.active ? (
                          <ToggleRight size={28} className="text-sage-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-warm-300" />
                        )}
                      </motion.button>

                      {/* 详情入口 */}
                      <ChevronRight size={14} className="shrink-0 text-warm-300" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )
        })}
      </div>

      {/* 习惯详情弹窗 */}
      <HabitDetailModal
        habit={selectedHabit}
        onClose={() => setSelectedHabit(null)}
      />
    </motion.div>
  )
}
