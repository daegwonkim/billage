// RFC 7807 ProblemDetail 형식
export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string

  constructor(response: ProblemDetail) {
    super(response.detail ?? response.title ?? 'An error occurred')
    this.type = response.type
    this.title = response.title
    this.status = response.status
    this.detail = response.detail
    this.instance = response.instance
    this.code = response.code
  }

  getMessage(): string {
    return getErrorMessage(this.code)
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  // 인증 관련
  INVALID_VERIFICATION_CODE: '인증코드가 올바르지 않아요. 다시 확인해주세요.',
  VERIFICATION_CODE_EXPIRED: '인증코드가 만료됐어요. 다시 요청해주세요.',
  NEIGHBORHOOD_VERIFICATION_FAILED:
    '동네 인증에 실패했어요. 현재 위치를 다시 확인해주세요.',
  AUTHENTICATION_FAILED: '인증에 실패했어요.',

  USER_NOT_FOUND: '계정을 찾을 수 없어요.',
  RENTAL_ITEM_NOT_FOUND: '대여 상품을 찾을 수 없어요.',
  UNSUPPORTED_REGION: '아직 지원하지 않는 지역이에요.',

  INTERNAL_SERVER_ERROR:
    '서버 내부 오류가 발생했아요. 잠시 후 다시 시도해주세요.'
}

const DEFAULT_MESSAGE = '문제가 발생했어요. 잠시 후 다시 시도해주세요.'

export function getErrorMessage(code?: string): string {
  if (!code) return DEFAULT_MESSAGE
  return ERROR_MESSAGES[code] ?? DEFAULT_MESSAGE
}
