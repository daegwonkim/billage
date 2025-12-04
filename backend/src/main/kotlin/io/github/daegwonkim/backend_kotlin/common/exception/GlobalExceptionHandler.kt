package io.github.daegwonkim.backend_kotlin.common.exception

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(
        e: BusinessException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        log.warn("BusinessException: {}", e.message)

        val response = ErrorResponse.of(e.errorCode, request.requestURI)

        return ResponseEntity
            .status(e.errorCode.status)
            .body(response)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        e: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        log.warn("Validation failed: {}", e.message)

        val fieldErrors = e.bindingResult.fieldErrors.map { fieldError ->
            ErrorResponse.FieldError(
                field = fieldError.field,
                value = fieldError.rejectedValue?.toString() ?: "",
                reason = fieldError.defaultMessage
            )
        }

        val response = ErrorResponse.of(
            ErrorCode.INVALID_INPUT_VALUE,
            request.requestURI,
            fieldErrors
        )

        return ResponseEntity
            .badRequest()
            .body(response)
    }

    @ExceptionHandler(Exception::class)
    fun handleException(
        e: Exception,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        log.error("Unexpected error occurred", e)

        val response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, request.requestURI)

        return ResponseEntity
            .internalServerError()
            .body(response)
    }
}