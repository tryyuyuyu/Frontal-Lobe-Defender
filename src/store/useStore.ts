import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Habit, EmotionEntry, AppSettings } from '../types'
import { uid } from '../lib/uid'

// ============================================================
// Mock data — 预置示例习惯，让仪表盘首次加载不空旷
// ============================================================
const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: '晨间冥想 5 分钟',
    description: '醒来后静坐 5 分钟，观察呼吸，不评判任何念头。降低皮质醇水平，为前额叶"预热"。',
    category: 'life',
    icon: 'Brain',
    active: true,
    completedToday: false,
    streak: 7,
    createdAt: '2026-05-20T08:00:00Z',
    habitDetails: {
      steps: ['醒来后不要立即看手机', '找一个安静角落坐下', '闭眼，自然呼吸，注意力放在鼻尖', '念头飘走时温柔带回，不评判', '5 分钟后慢慢睁眼，感受身体'],
      brainBenefit: '晨间冥想降低皮质醇（压力激素）水平，提高前额叶血流量，相当于为一天的高效思考"预热引擎"。',
    },
  },
  {
    id: '2',
    name: '喝满 8 杯水',
    description: '全天分次补水，每次约 200ml。脱水会导致注意力下降 20%，直接拖累前额叶功能。',
    category: 'diet',
    icon: 'Droplets',
    active: true,
    completedToday: false,
    streak: 4,
    createdAt: '2026-05-22T09:00:00Z',
    habitDetails: {
      steps: ['早晨起床第一杯（200ml 温水）', '上午 10 点第二杯', '午饭前 30 分钟第三杯', '下午 2 点第四杯', '下午 4 点第五杯', '傍晚 6 点第六杯', '晚饭后第七杯', '睡前 1 小时第八杯'],
      brainBenefit: '大脑 75% 是水。即使轻度脱水也会使前额叶皮层萎缩，导致注意力下降 20% 和工作记忆减退。',
    },
  },
  {
    id: '3',
    name: '晚上 11 点前放下手机',
    description: '睡前 30 分钟断开屏幕。蓝光抑制褪黑素分泌，影响前额叶在睡眠中的代谢废物清除。',
    category: 'sleep',
    icon: 'Moon',
    active: true,
    completedToday: false,
    streak: 3,
    createdAt: '2026-05-25T22:00:00Z',
    habitDetails: {
      steps: ['设定手机自动进入勿扰模式（22:30）', '将手机放在卧室以外的房间充电', '准备一本纸质书作为替代活动', '调暗室内灯光，营造入睡氛围', '如果睡不着，做 4-7-8 呼吸法'],
      brainBenefit: '蓝光抑制褪黑素分泌达 50%，而褪黑素是清除前额叶β-淀粉样蛋白的关键激素——这直接影响第二天的决策能力。',
    },
  },
  {
    id: '4',
    name: '户外散步 15 分钟',
    description: '低强度有氧运动提升 BDNF（脑源性神经营养因子），直接促进前额叶神经可塑性。',
    category: 'life',
    icon: 'Footprints',
    active: false,  // 默认非激活——超过 3 个限制，用户需手动切换
    completedToday: false,
    streak: 5,
    createdAt: '2026-05-18T07:30:00Z',
    habitDetails: {
      steps: ['换上舒适的鞋子出门', '选择一条有树荫的路线', '走路时关注呼吸节奏（吸 4 步 / 呼 4 步）', '观察周围 3 种颜色、2 种声音、1 种气味', '至少 15 分钟后慢慢结束'],
      brainBenefit: '15 分钟低强度有氧即可提升 BDNF 水平 20%，BDNF 像"大脑肥料"一样促进前额叶神经元生长和连接。',
    },
  },
  // ---- 生活习惯 ----
  {
    id: '5',
    name: '两分钟法则',
    description: '如果一件事能在两分钟内完成，就立刻处理掉它，不给大脑积压待办清单。',
    category: 'life',
    icon: 'Timer',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-01T08:00:00Z',
    habitDetails: {
      steps: [
        '遇到琐碎小事（回复消息、整理桌面、倒垃圾）时暂停 3 秒',
        '自问：这件事能在 2 分钟内完成吗？',
        '如果能 → 立刻处理，不放入待办清单',
        '如果已堆积了很多小事，每天安排一次"2 分钟扫尾时间"集中处理',
        '完成后给自己一个小肯定（点头/微笑即可）',
      ],
      brainBenefit: '大脑的"蔡格尼克效应"会持续消耗前额叶资源来记住未完成的小事。两分钟法则通过立刻处理来关闭这些"打开的心理循环"，直接释放认知负荷。',
    },
  },
  {
    id: '6',
    name: '呼吸调节',
    description: '焦虑或压力袭来时，刻意做三次深长的腹式呼吸，迅速平复杏仁核的警报信号。',
    category: 'life',
    icon: 'Wind',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-01T09:00:00Z',
    habitDetails: {
      steps: [
        '感到紧张时先暂停——识别身体信号（心跳加快、肩膀紧绷）',
        '鼻子缓慢吸气 4 秒，感受腹部鼓起（不是胸部）',
        '屏住呼吸 2 秒，让氧气充分交换',
        '嘴巴缓慢呼气 6 秒，想象把压力呼出体外',
        '重复 3 次为一组，每天任何时刻都可以做',
      ],
      brainBenefit: '深长呼吸直接激活副交感神经系统，降低皮质醇水平。3 次腹式呼吸即可将前额叶从"战斗逃跑模式"切换回理性决策模式——因为杏仁核劫持时，前额叶的血流会减少 30%。',
    },
  },
  {
    id: '7',
    name: '杂念清空',
    description: '工作时随手在便签上写下突然冒出的杂念，告诉自己"稍后专门处理"，然后立刻回到工作。',
    category: 'life',
    icon: 'StickyNote',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-01T10:00:00Z',
    habitDetails: {
      steps: [
        '在工位旁放一本便签纸或打开一个随手记 app',
        '当杂念出现时（"别忘了交水电费""那个邮件还没回"），用一句话写下',
        '对自己说："记下了，稍后处理"——这是关键的心理仪式',
        '继续手头的工作，不要展开杂念',
        '每天安排 15 分钟"杂念处理时间"统一清空便签',
      ],
      brainBenefit: '未处理的杂念占用前额叶的"工作记忆"缓冲区——就像电脑后台运行太多程序。写下杂念会触发"外部化效应"：大脑认为信息已安全存储，释放前额叶资源用于当前任务。',
    },
  },
  // ---- 饮食 ----
  {
    id: '8',
    name: '优质脂肪摄入',
    description: '每天摄入一定量的优质脂肪（坚果、牛油果、深海鱼），为神经元髓鞘提供必需原料。',
    category: 'diet',
    icon: 'Nut',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-02T08:00:00Z',
    habitDetails: {
      steps: [
        '每天一小把原味坚果（约 30g，核桃/杏仁/腰果）作为上午加餐',
        '或半个牛油果加入午餐沙拉',
        '每周吃 2-3 次深海鱼（三文鱼/秋刀鱼/鲭鱼），每次掌心大小',
        '用橄榄油或亚麻籽油替代部分烹饪油',
        '避免反式脂肪——看食品配料表里的"氢化植物油"字样',
      ],
      brainBenefit: '大脑干重 60% 是脂肪，其中 Omega-3（DHA）构成神经元细胞膜和髓鞘的核心材料。髓鞘越完整，前额叶信号传导速度越快——这直接关系到反应速度和决策质量。',
    },
  },
  {
    id: '9',
    name: '断糖控制',
    description: '减少游离糖摄入，避免血糖剧烈波动导致的前额叶"脑雾"现象。',
    category: 'diet',
    icon: 'CandyOff',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-02T09:00:00Z',
    habitDetails: {
      steps: [
        '用水果替代含糖饮料和甜点——想吃糖时先吃一小份蓝莓或苹果',
        '下午茶用无糖酸奶+坚果替代蛋糕饼干',
        '看配料表：如果"糖"排在前三位，或每 100g 含糖 >15g，尽量不吃',
        '咖啡和茶不加糖，逐步减到习惯天然味道',
        '如果想吃巧克力，选 70% 以上可可含量的黑巧，每天不超过 2 小块',
      ],
      brainBenefit: '血糖剧烈波动导致脑部胰岛素抵抗，前额叶神经元能量供应不稳——你感到的"下午脑雾"本质上就是前额叶缺能。稳定血糖 = 稳定认知输出。',
    },
  },
  // ---- 睡眠 ----
  {
    id: '10',
    name: '七小时睡眠目标',
    description: '将每日睡眠时间设定为不少于 7 小时，这是前额叶进行深度代谢清理的最低门槛。',
    category: 'sleep',
    icon: 'Clock',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-03T22:00:00Z',
    habitDetails: {
      steps: [
        '根据起床时间倒推入睡时间（如 7:00 起床 → 23:30 前入睡，留 30 分钟缓冲）',
        '睡前 1 小时把灯光调暗为暖色调，模拟日落',
        '保持卧室温度在 18-22°C，这是睡眠最佳温度区间',
        '固定起床时间比固定入睡时间更重要——即使周末也不要有超过 1 小时的偏差',
        '如果躺下 20 分钟仍睡不着，起来做一件安静的事直到困意来袭',
      ],
      brainBenefit: '睡眠期间，大脑的"类淋巴系统"会清除前额叶中积累的代谢废物（包括β-淀粉样蛋白和 tau 蛋白）。这个清理过程需要至少 7 小时的完整睡眠周期——少于 7 小时等于"大脑没倒完垃圾"。',
    },
  },
  {
    id: '11',
    name: '睡前数码排毒',
    description: '睡前半小时完全远离手机和屏幕，用纸质书或轻柔音乐替代，帮助褪黑素正常分泌。',
    category: 'sleep',
    icon: 'PhoneOff',
    active: false,
    completedToday: false,
    streak: 0,
    createdAt: '2026-06-03T23:00:00Z',
    habitDetails: {
      steps: [
        '设定手机自动开启"睡眠模式"（建议 22:00）——屏幕变灰、通知静音',
        '将手机充电器移到卧室以外的地方——物理隔离最有效',
        '准备一本"床头书"（推荐散文、传记等低刺激读物，避免悬疑小说）',
        '听 15 分钟白噪音或自然声音（雨声/溪流）替代刷短视频',
        '如果忍不住想看手机，问自己："这个信息明天早上看会有什么损失？"',
      ],
      brainBenefit: '屏幕蓝光以 480nm 波长直接抑制松果体分泌褪黑素——每看手机 1 小时，褪黑素分泌延迟 1.5 小时。褪黑素不仅是"睡眠激素"，更是前额叶夜间代谢清理的启动信号。',
    },
  },
]

// ============================================================
// Store 接口
// ============================================================
interface AppStore {
  // 状态
  habits: Habit[]
  emotionHistory: EmotionEntry[]
  settings: AppSettings

  // 习惯操作
  toggleHabitComplete: (id: string) => void
  toggleActive: (id: string) => boolean   // 返回 false 表示被 3 上限阻止
  addHabit: (habit: Omit<Habit, 'id' | 'active' | 'completedToday' | 'streak' | 'createdAt'>) => void
  removeHabit: (id: string) => void
  resetDailyHabits: () => void

  // 情绪记录
  addEmotionEntry: (entry: Omit<EmotionEntry, 'id' | 'createdAt'>) => void

  // 设置
  updateSettings: (partial: Partial<AppSettings>) => void

  // 计算
  getActiveCount: () => number
  getTodayProgress: () => number
  getCompletedCount: () => number
}

// ============================================================
// Zustand Store (带 localStorage 持久化)
// ============================================================
export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      habits: MOCK_HABITS,
      emotionHistory: [],
      settings: {
        morningReminder: true,
        eveningReminder: false,
      },

      toggleHabitComplete: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedToday: !h.completedToday,
                  streak: !h.completedToday ? h.streak + 1 : h.streak - 1,
                }
              : h
          ),
        })),

      // 切换习惯激活状态 —— 上限 3 个
      toggleActive: (id) => {
        const state = get()
        const habit = state.habits.find((h) => h.id === id)
        if (!habit) return false

        // 如果要激活，先检查是否已达上限
        if (!habit.active) {
          const activeCount = state.habits.filter((h) => h.active).length
          if (activeCount >= 3) {
            return false // 调用方负责 toast 提示
          }
        }

        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, active: !h.active } : h
          ),
        }))
        return true
      },

      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: uid(),
              active: true,  // 新建习惯默认激活
              completedToday: false,
              streak: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((h) => ({ ...h, completedToday: false })),
        })),

      addEmotionEntry: (entry) =>
        set((state) => ({
          emotionHistory: [
            {
              ...entry,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
            ...state.emotionHistory,
          ],
        })),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      getActiveCount: () => {
        return get().habits.filter((h) => h.active).length
      },

      getTodayProgress: () => {
        const active = get().habits.filter((h) => h.active)
        if (active.length === 0) return 0
        const done = active.filter((h) => h.completedToday).length
        return Math.round((done / active.length) * 100)
      },

      getCompletedCount: () => {
        return get().habits.filter((h) => h.completedToday).length
      },
    }),
    {
      name: 'trydefender-storage',
      partialize: (state) => ({
        habits: state.habits,
        emotionHistory: state.emotionHistory,
        settings: state.settings,
      }),
    }
  )
)
