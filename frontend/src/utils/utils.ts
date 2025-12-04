export function getTimeAgo(date: Date) {
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000

  if (diff < 60) return '방금 전'
  if (diff < 60 * 60) return `${Math.floor(diff / 60)}분 전`
  if (diff < 60 * 60 * 24) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

export const formatPhoneNumber = (value: string) => {
  // 숫자만 추출
  const digits = value.replace(/\D/g, '')

  // 11자리 기준 (010-1234-5678)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

export const formatBirthNumber = (value: string) => {
  const numbers = value.replace(/[^0-9]/g, '')
  if (numbers.length <= 6) {
    return numbers
  }
  return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`
}
