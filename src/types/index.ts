// ============================================================
// Core types for 保卫前额叶 (Frontal Lobe Defender)
// ============================================================

/** 习惯分类维度 */
export type HabitCategory = 'life' | 'diet' | 'sleep'

/** 习惯实体 */
export interface Habit {
  id: string
  name: string
  description: string
  category: HabitCategory
  icon: string
  active: boolean          // 是否激活（最多 3 个）—— 激活的习惯才显示在首页
  completedToday: boolean
  streak: number
  createdAt: string
  /** 详细说明 — 用于习惯详情弹窗 (#2) */
  habitDetails?: {
    steps: string[]         // 具体操作步骤
    brainBenefit: string    // 脑力收益原理
  }
}

/** 情绪垃圾桶条目 */
export interface EmotionEntry {
  id: string
  content: string
  aiResponse: string
  createdAt: string
}

/** 应用设置 */
export interface AppSettings {
  morningReminder: boolean   // 早八提醒
  eveningReminder: boolean   // 晚九提醒
}

/** 分类元数据 */
export interface CategoryMeta {
  key: HabitCategory
  label: string
  icon: string
  color: string
}

/** AI 消息格式 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
