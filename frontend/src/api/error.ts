// RFC 7807 ProblemDetail 형식
export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  type?: string
  title?: string
  status: number
  detail?: string
  instance?: string

  constructor(response: ProblemDetail, status: number) {
    super(response.detail ?? response.title ?? 'An error occurred')
    this.type = response.type
    this.title = response.title
    this.status = status
    this.detail = response.detail
    this.instance = response.instance
  }

  static fromResponse(response: ProblemDetail, status: number): ApiError {
    return new ApiError(response, status)
  }
}
