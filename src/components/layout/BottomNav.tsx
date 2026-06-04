import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Library, Plus, BarChart3, User } from 'lucide-react'

// ============================================================
// 导航项配置 — 5 模块：[首页, 习惯库, +, 统计, 我的]
// ============================================================
const NAV_ITEMS = [
  {
    to: '/',
    label: '首页',
    icon: Home,
    isCenter: false,
  },
  {
    to: '/habits',
    label: '习惯库',
    icon: Library,
    isCenter: false,
  },
  {
    to: '/emotion-bin',
    label: '倾倒烦恼',
    icon: Plus,
    isCenter: true,   // 中心突起 — 核心功能快捷入口
  },
  {
    to: '/stats',
    label: '统计',
    icon: BarChart3,
    isCenter: false,
  },
  {
    to: '/profile',
    label: '我的',
    icon: User,
    isCenter: false,
  },
]

// ============================================================
// BottomNav — 全宽浮动导航栏，5 模块均匀分布
// ============================================================
export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.2 }}
        className="mx-4 mb-4 flex w-[calc(100%-2rem)] max-w-lg items-center gap-1 rounded-full
                   bg-white/80 backdrop-blur-xl border border-white/60
                   px-3 py-2 shadow-float"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon

          // 中间的 "+" 按钮 — 特殊样式（突起、醒目）
          if (item.isCenter) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative -mt-6 mx-0.5"
                aria-label={item.label}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  className={`
                    flex h-14 w-14 items-center justify-center rounded-full
                    shadow-lg transition-all duration-200
                    ${isActive
                      ? 'bg-sage-500 text-white shadow-sage-500/40 scale-105'
                      : 'bg-sage-400 text-white hover:bg-sage-500 hover:shadow-sage-500/25'
                    }
                  `}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </motion.div>

                {/* 活跃指示点 */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-center"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sage-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            )
          }

          // 普通导航项 — flex-1 均分剩余空间，图标+文字垂直对齐
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
            >
              <div
                className={`
                  flex h-9 w-9 items-center justify-center rounded-full
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-sage-100 text-sage-600'
                    : 'text-warm-400 hover:text-sage-500'
                  }
                `}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* 文字标签 — 始终显示，激活态高亮 */}
              <span
                className={`
                  text-[10px] leading-none font-medium
                  transition-colors duration-200
                  ${isActive ? 'text-sage-600' : 'text-warm-400'}
                `}
              >
                {item.label}
              </span>

              {/* 活跃指示条 */}
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-sage-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          )
        })}
      </motion.div>
    </nav>
  )
}
