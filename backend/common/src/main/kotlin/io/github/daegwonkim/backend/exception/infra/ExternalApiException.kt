package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.base.ErrorCode

class ExternalApiException(
    externalApi: ExternalApi,
    requestUrl: String? = null,
    val statusCode: Int? = null,
    cause: Throwable? = null,
) : InfraException(
    message = "${externalApi.apiName} API 호출 실패: url: $requestUrl, status: $statusCode",
    errorCode = ErrorCode.EXTERNAL_API_ERROR,
    cause = cause
) {
    enum class ExternalApi(val apiName: String) {
        COOLSMS("CoolSMS"),
        AMAZON_S3("Amazon S3")
    }
}