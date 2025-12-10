export interface ApiErrorResponse {
  code: string
  message: string
  timestamp: string
  path: string
  errors?: Record<string, string>
}

export class ApiError extends Error {
  code: string
  status: number
  path: string
  errors?: Record<string, string>

  constructor(
    code: string,
    message: string,
    status: number,
    path: string,
    errors?: Record<string, string>
  ) {
    super(message)
    this.code = code
    this.status = status
    this.path = path
    this.errors = errors
  }
}

export const ErrorMessageMap: Record<string, string> = {
  'A-001': '인증번호가 만료되었습니다',
  'A-002': '인증번호가 일치하지 않습니다',
  'A-003': '인증 시간이 초과되었습니다',
  'N-001': '지역 정보를 찾을 수 없습니다',
  'N-002': '선택하신 위치와 실제 위치가 일치하지 않습니다',
  'E-001': 'SMS 전송에 실패했습니다. 잠시 후 다시 시도해주세요'
}
