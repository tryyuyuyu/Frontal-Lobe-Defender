import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import CognitiveLoadBar from '../components/dashboard/CognitiveLoadRing'
import HabitCard from '../components/dashboard/HabitCard'
import { useStore } from '../store/useStore'

// ============================================================
// Home — 首页仪表盘
// 视觉重心：认知负荷圆环 + 今日习惯列表
// ============================================================
export default function Home() {
  const habits = useStore((s) => s.habits)
  const activeHabits = habits.filter((h) => h.active)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ========== 头部欢迎区 ========== */}
      <header>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-medium uppercase tracking-wider text-sage-500"
        >
          Frontal Lobe Defender
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-1 text-2xl font-bold text-warm-800"
        >
          保卫前额叶
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-1 text-sm text-warm-500"
        >
          给大脑减负，从每个微习惯开始
        </motion.p>
      </header>

      {/* ========== 认知负荷进度条 ========== */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="py-2"
      >
        <CognitiveLoadBar />
      </motion.section>

      {/* ========== 今日习惯区 ========== */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-warm-700">
            今日微习惯
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-medium text-sage-600 transition-colors hover:bg-sage-200"
            onClick={() => {
              // TODO: 打开添加习惯弹窗 — Phase 2
            }}
          >
            <Plus size={14} />
            添加
          </motion.button>
        </div>

        {activeHabits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-warm-300 p-8 text-center"
          >
            <p className="text-sm text-warm-400">还没有激活的习惯，去习惯库激活吧 🌿</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activeHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200, damping: 22 }}
              >
                <HabitCard habit={habit} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 底部留白提示 */}
      <p className="text-center text-[10px] text-warm-300">
        最多同时专注 3 个习惯 · 点击底部 + 倾倒烦恼
      </p>
    </motion.div>
  )
}
