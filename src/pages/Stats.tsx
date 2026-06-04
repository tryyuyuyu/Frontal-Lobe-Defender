import { motion } from 'framer-motion'
import { TrendingUp, Target, Flame, CalendarCheck } from 'lucide-react'
import { useStore } from '../store/useStore'

// ============================================================
// Stats — 统计页面
// 展示习惯完成情况的汇总数据
// ============================================================
export default function Stats() {
  const habits = useStore((s) => s.habits)
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const activeHabits = habits.filter((h) => h.active).length
  const completedToday = habits.filter((h) => h.completedToday).length

  // 计算本周完成率（基于当前数据估算）
  const weekCompletionRate = habits.length > 0
    ? Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100)
    : 0

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
          Statistics
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-1 text-2xl font-bold text-warm-800"
        >
          数据统计
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-1 text-sm text-warm-500"
        >
          你的前额叶训练记录
        </motion.p>
      </header>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Target size={18} />}
          label="激活习惯"
          value={activeHabits}
          unit="个"
          color="sage"
          delay={0.15}
        />
        <StatCard
          icon={<CalendarCheck size={18} />}
          label="今日完成"
          value={completedToday}
          unit="项"
          color="warm"
          delay={0.2}
        />
        <StatCard
          icon={<Flame size={18} />}
          label="累计坚持"
          value={totalStreak}
          unit="天"
          color="warm"
          delay={0.25}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="今日完成率"
          value={weekCompletionRate}
          unit="%"
          color="sage"
          delay={0.3}
        />
      </div>

      {/* 习惯详情列表 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="mb-3 text-sm font-semibold text-warm-700">各习惯进度</h2>
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center gap-3 rounded-xl border border-warm-100 bg-white/60 p-3 backdrop-blur-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-warm-800">{habit.name}</h3>
                  {!habit.active && (
                    <span className="rounded-full bg-warm-100 px-1.5 py-0.5 text-[10px] text-warm-400">
                      未激活
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-xs text-warm-500">
                  <Flame size={12} />
                  {habit.streak} 天 · 今日 {habit.completedToday ? '✅' : '⏳'}
                </div>
              </div>

              {/* 迷你进度条 */}
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-warm-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    habit.completedToday ? 'bg-sage-400' : 'bg-warm-200'
                  }`}
                  style={{ width: habit.completedToday ? '100%' : `${Math.min(habit.streak * 5, 80)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}

// ============================================================
// 统计卡片子组件
// ============================================================
function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string
  color: 'sage' | 'warm'
  delay: number
}) {
  const colorMap = {
    sage: {
      border: 'border-sage-200',
      bg: 'bg-sage-50/60',
      iconBg: 'bg-sage-100 text-sage-600',
      value: 'text-sage-600',
      label: 'text-sage-500',
      unit: 'text-sage-400',
    },
    warm: {
      border: 'border-warm-200',
      bg: 'bg-warm-50/60',
      iconBg: 'bg-warm-100 text-warm-600',
      value: 'text-warm-600',
      label: 'text-warm-500',
      unit: 'text-warm-400',
    },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 22 }}
      className={`rounded-2xl border ${c.border} ${c.bg} p-4 backdrop-blur-sm`}
    >
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}>
        {icon}
      </div>
      <p className={`text-xs ${c.label}`}>{label}</p>
      <p className={`mt-1 text-3xl font-bold ${c.value}`}>
        {value}
        <span className={`ml-0.5 text-sm font-normal ${c.unit}`}>{unit}</span>
      </p>
    </motion.div>
  )
}
