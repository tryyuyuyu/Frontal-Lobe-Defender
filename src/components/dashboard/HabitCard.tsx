import { motion } from 'framer-motion'
import { Flame, CheckCircle2, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { toast } from 'sonner'
import type { Habit } from '../../types'
import { useStore } from '../../store/useStore'

// ============================================================
// 动态图标映射
// ============================================================
function getIcon(iconName: string, size = 20) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as Record<string, any>
  const Icon = icons[iconName]
  if (Icon) return <Icon size={size} />
  return <LucideIcons.Brain size={size} />
}

// ============================================================
// 脑力值计算 — 根据习惯类型和连续天数
// ============================================================
function calcBrainPower(habit: Habit): number {
  const base = 15
  const streakBonus = Math.min(habit.streak, 10) * 2
  const categoryBonus: Record<string, number> = {
    life: 5,
    diet: 3,
    sleep: 3,
  }
  return base + streakBonus + (categoryBonus[habit.category] || 0)
}

// ============================================================
// 分类颜色映射
// ============================================================
const CATEGORY_STYLES: Record<string, { bg: string; dot: string; label: string }> = {
  life:  { bg: 'bg-sage-50 border-sage-200',  dot: 'bg-sage-400', label: '生活' },
  diet:  { bg: 'bg-warm-50 border-warm-200',  dot: 'bg-warm-500', label: '饮食' },
  sleep: { bg: 'bg-sage-50/50 border-sage-100', dot: 'bg-sage-500', label: '睡眠' },
}

// ============================================================
// HabitCard — 习惯打卡卡片
// 点击卡片主体 = 完成打卡；右侧"移除"按钮 = 取消激活
// ============================================================
interface HabitCardProps {
  habit: Habit
}

export default function HabitCard({ habit }: HabitCardProps) {
  const toggleHabitComplete = useStore((s) => s.toggleHabitComplete)
  const toggleActive = useStore((s) => s.toggleActive)
  const categoryStyle = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.life

  const handleCardClick = () => {
    toggleHabitComplete(habit.id)

    // 仅在完成时弹出脑力值反馈
    if (!habit.completedToday) {
      const points = calcBrainPower(habit)
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <div>
            <span className="font-semibold text-sage-700">今日节省了 {points} 点脑力值</span>
            <p className="text-xs text-warm-500">
              {habit.name} · 连签 {habit.streak + 1} 天
            </p>
          </div>
        </div>,
        {
          duration: 2500,
          style: {
            background: '#f6f8f4',
            border: '1px solid #d1e0c7',
          },
        }
      )
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止冒泡，避免触发打卡
    toggleActive(habit.id)

    toast(`${habit.name} 已从仪表盘移除`, {
      description: '你可以随时在习惯库中重新激活它',
      duration: 2000,
      style: {
        background: '#fdfbf8',
        border: '1px solid #f5e9d2',
        color: '#856053',
        fontSize: '13px',
      },
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={handleCardClick}
      className={`
        group relative flex items-center gap-3 rounded-2xl border p-4
        cursor-pointer select-none
        transition-all duration-200 active:scale-[0.98]
        ${categoryStyle.bg}
        ${habit.completedToday ? 'opacity-65' : 'hover:shadow-md hover:border-sage-300'}
      `}
    >
      {/* 完成态覆盖层 — 左侧绿色竖线 */}
      {habit.completedToday && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-sage-400"
          style={{ transformOrigin: 'top' }}
        />
      )}

      {/* 左侧图标 */}
      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          transition-colors duration-200
          ${habit.completedToday ? 'bg-sage-200 text-sage-600' : 'bg-white/80 text-sage-500 group-hover:bg-white'}
        `}
      >
        {habit.completedToday ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <CheckCircle2 size={20} className="text-sage-500" />
          </motion.div>
        ) : (
          getIcon(habit.icon, 20)
        )}
      </div>

      {/* 中间文字 */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
            text-sm font-semibold transition-all duration-200
            ${habit.completedToday ? 'text-warm-500 line-through' : 'text-warm-800'}
          `}
        >
          {habit.name}
        </h3>
        <p className="mt-0.5 text-xs text-warm-400 truncate">
          {habit.description}
        </p>

        {/* 底部元信息 */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${categoryStyle.dot}`} />
          <span className="text-[10px] text-warm-400">{categoryStyle.label}</span>

          {habit.streak > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-warm-500">
              <Flame size={10} className="text-warm-500" />
              {habit.streak} 天
            </span>
          )}

          {habit.completedToday && (
            <span className="rounded-full bg-sage-100 px-1.5 py-0.5 text-[10px] font-medium text-sage-600">
              已完成
            </span>
          )}
        </div>
      </div>

      {/* 右侧"移除"按钮 — 仅 hover 时可见 */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleRemove}
        className="shrink-0 rounded-lg p-2 text-warm-300 opacity-0 transition-all
                   group-hover:opacity-100 hover:bg-red-50 hover:text-red-400"
        aria-label="移除习惯"
        title="从仪表盘移除"
      >
        <X size={16} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  )
}
