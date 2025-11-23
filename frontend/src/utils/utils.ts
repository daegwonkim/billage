export function getTimeAgo(date: Date) {
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000

  if (diff < 60) return '방금 전'
  if (diff < 60 * 60) return `${Math.floor(diff / 60)}분 전`
  if (diff < 60 * 60 * 24) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}
