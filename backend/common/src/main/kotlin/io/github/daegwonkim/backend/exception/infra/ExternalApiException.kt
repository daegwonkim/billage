package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.base.ErrorCode

class ExternalApiException(
    val apiName: String,
    val statusCode: Int? = null,
    cause: Throwable? = null,
) : InfraException(
    message = "$apiName API 호출 실패 (status: $statusCode)",
    errorCode = ErrorCode.EXTERNAL_API_ERROR,
    cause = cause
)