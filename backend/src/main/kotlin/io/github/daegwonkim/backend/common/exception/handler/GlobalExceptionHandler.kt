package io.github.daegwonkim.backend.common.exception.handler

import io.github.daegwonkim.backend.common.exception.base.BusinessException
import io.github.daegwonkim.backend.common.exception.data.ErrorCode
import io.github.daegwonkim.backend.common.exception.data.ErrorResponse
import io.github.daegwonkim.backend.common.exception.base.InfrastructureException
import io.github.daegwonkim.backend.logger
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(
        e: BusinessException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        logger.warn { "BusinessException: ${e.message}" }

        val response = ErrorResponse.Companion.of(e.errorCode, request.requestURI)

        return ResponseEntity
            .status(e.errorCode.status)
            .body(response)
    }

    @ExceptionHandler(InfrastructureException::class)
    fun handleInfrastructureException(
        e: InfrastructureException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        logger.warn { "InfrastructureException: ${e.message}" }

        val response = ErrorResponse.Companion.of(e.errorCode, request.requestURI)

        return ResponseEntity
            .status(e.errorCode.status)
            .body(response)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        e: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        logger.warn { "Validation failed: ${e.message}" }

        val fieldErrors = e.bindingResult.fieldErrors.map { fieldError ->
            ErrorResponse.FieldError(
                field = fieldError.field,
                value = fieldError.rejectedValue?.toString() ?: "",
                reason = fieldError.defaultMessage
            )
        }

        val response = ErrorResponse.Companion.of(
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
        logger.error { "Unexpected error occurred $e" }

        val response = ErrorResponse.Companion.of(ErrorCode.INTERNAL_SERVER_ERROR, request.requestURI)

        return ResponseEntity
            .internalServerError()
            .body(response)
    }
}