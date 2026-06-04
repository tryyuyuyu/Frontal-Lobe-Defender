/**
 * 生成唯一 ID
 * crypto.randomUUID() 仅 secure context (localhost/HTTPS) 可用
 * IP 访问或非标准端口时降级为 crypto.getRandomValues
 */
export function uid(): string {
  // 优先使用标准 API
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  // 降级：crypto.getRandomValues (所有现代浏览器都支持)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 3)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }

  // 最终降级：时间戳 + 随机数
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 10)
  return `${t}-${r}-4${r.slice(0, 3)}-${r.slice(0, 4)}-${r}${r.slice(0, 4)}`
}
