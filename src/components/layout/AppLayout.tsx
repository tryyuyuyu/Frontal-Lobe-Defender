import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout — 手机端优先的布局容器
 * 顶部留出安全区，底部为浮动导航栏预留空间
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-warm-50">
      {/* 主内容区 — 底部预留导航栏高度 */}
      <main className="px-5 pt-6 pb-28">
        {children}
      </main>

      {/* 浮动底部导航栏 */}
      <BottomNav />
    </div>
  )
}
