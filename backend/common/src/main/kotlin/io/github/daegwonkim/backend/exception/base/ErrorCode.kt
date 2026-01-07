package io.github.daegwonkim.backend.exception.base

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val code: String,
    val status: HttpStatus
) {
    // 4xx
    VALIDATION_FAILED("VALIDATION_FAILED", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", HttpStatus.UNAUTHORIZED),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND),
    RESOURCE_DUPLICATE("RESOURCE_DUPLICATE", HttpStatus.CONFLICT),

    // 5xx
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR),
    EXTERNAL_API_ERROR("EXTERNAL_API_ERROR", HttpStatus.BAD_GATEWAY)
}