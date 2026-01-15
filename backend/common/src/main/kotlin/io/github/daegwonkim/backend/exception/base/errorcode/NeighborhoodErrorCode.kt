package io.github.daegwonkim.backend.exception.base.errorcode

import org.springframework.http.HttpStatus

enum class NeighborhoodErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    UNSUPPORTED_REGION("UNSUPPORTED_REGION", "지원하지 않는 지역입니다", HttpStatus.UNPROCESSABLE_CONTENT)
}