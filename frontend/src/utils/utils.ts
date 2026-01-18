export function getTimeAgo(date: Date) {
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000

  if (diff < 60) return '방금 전'
  if (diff < 60 * 60) return `${Math.floor(diff / 60)}분 전`
  if (diff < 60 * 60 * 24) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

export const formatPhoneNo = (value: string) => {
  // 숫자만 추출
  const digits = value.replace(/\D/g, '')

  // 11자리 기준 (010-1234-5678)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

// 가격 포맷팅용 함수
export const formatPrice = (value: string) => {
  const numbers = value.replace(/[^\d]/g, '')
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 십만원 단위까지는 100,000, 백만원 이상은 100만 형식으로 포맷팅
export function formatCompactPrice(price: number): string {
  if (price >= 1000000) {
    const millions = price / 10000
    return `${millions}만`
  }
  return price.toLocaleString('ko-KR')
}

export function formatRecentActivitySimple(
  lastActiveAt: string | Date
): string {
  const last = new Date(lastActiveAt)
  if (isNaN(last.getTime())) return ''

  const diffMs = Date.now() - last.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 3) return '최근 3일 이내 활동'
  if (diffDays < 7) return '최근 7일 이내 활동'
  if (diffDays < 30) return '최근 1개월 이내 활동'

  return '1개월 이상 활동 없음'
}

export function formatJoinDate(createdAt: string | Date): string {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt

  if (isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}년 ${month.toString().padStart(2, '0')}월 ${day
    .toString()
    .padStart(2, '0')}일 가입`
}

export function formatNeighborhoodVerifiedPeriod(
  verifiedAt: string | Date
): string {
  const verifiedDate =
    typeof verifiedAt === 'string' ? new Date(verifiedAt) : verifiedAt

  const now = new Date()

  let months =
    (now.getFullYear() - verifiedDate.getFullYear()) * 12 +
    (now.getMonth() - verifiedDate.getMonth())

  // 아직 이번 달의 인증일이 안 지났으면 한 달 차감
  if (now.getDate() < verifiedDate.getDate()) {
    months -= 1
  }

  if (months < 0) months = 0

  // "N개월째"는 1부터 시작
  const displayMonths = months + 1

  if (displayMonths < 12) {
    return `동네 인증 ${displayMonths}개월째`
  }

  const years = Math.floor(displayMonths / 12)
  const remainingMonths = displayMonths % 12

  if (remainingMonths === 0) {
    return `동네 인증 ${years}년째`
  }

  return `동네 인증 ${years}년 ${remainingMonths}개월째`
}
