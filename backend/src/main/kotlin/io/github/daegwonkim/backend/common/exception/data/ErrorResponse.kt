package io.github.daegwonkim.backend.common.exception.data

import java.time.LocalDateTime


data class ErrorResponse(
    val code: String,
    val message: String,
    val timestamp: LocalDateTime,
    val path: String,
    val errors: List<FieldError>?
) {
    data class FieldError(
        val field: String,
        val value: String,
        val reason: String?
    )

    companion object {
        fun of(errorCode: ErrorCode, path: String): ErrorResponse = ErrorResponse(
            code = errorCode.code,
            message = errorCode.message,
            timestamp = LocalDateTime.now(),
            path = path,
            errors = null
        )

        fun of(errorCode: ErrorCode, path: String, errors: List<FieldError>): ErrorResponse = ErrorResponse(
            code = errorCode.code,
            message = errorCode.message,
            timestamp = LocalDateTime.now(),
            path = path,
            errors = errors
        )
    }
}
