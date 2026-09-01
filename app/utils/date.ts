export function formatDate(d: string | Date) {
  return new Date(d).toLocaleString('vi-VN')
}

export function formatTime(d: string | Date) {
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return date.toLocaleDateString('vi-VN')
}
