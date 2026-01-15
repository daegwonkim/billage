package io.github.daegwonkim.backend.exception

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.errorcode.CommonErrorCode
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.exception.infra.InfraException
import io.github.daegwonkim.backend.log.logger
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException::class)
    fun handleAuthenticationException(e: AuthenticationException): ProblemDetail {
        logger.warn(e) { e.message }
        return ProblemDetail.forStatusAndDetail(e.errorCode.status, e.errorCode.message).apply {
            setProperty("code", e.errorCode.code)
        }
    }

    @ExceptionHandler(BaseException::class)
    fun handleBaseException(e: BaseException): ProblemDetail {
        logger.error(e) { "${e.errorCode.code}: ${e.message}" }
        return ProblemDetail.forStatusAndDetail(e.errorCode.status, e.errorCode.message).apply {
            setProperty("code", e.errorCode.code)
        }
    }

    @ExceptionHandler(InfraException::class)
    fun handleInfraException(e: InfraException): ProblemDetail {
        logger.error(e) { "${e.errorCode.code}: ${e.message}" }
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다").apply {
            setProperty("code", CommonErrorCode.INTERNAL_SERVER_ERROR.code)
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValidException(e: MethodArgumentNotValidException): ProblemDetail {
        val errors = e.bindingResult.fieldErrors.map {
            mapOf("field" to it.field, "message" to (it.defaultMessage ?: "유효하지 않은 값입니다"))
        }
        logger.warn(e) { "입력값 검증 실패: ${errors.map { it["field"] }}" }
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "입력값 검증 실패").apply {
            setProperty("code", CommonErrorCode.VALIDATION_FAILED.code)
            setProperty("errors", errors)
        }
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ProblemDetail {
        logger.error(e) { "Unhandled exception" }
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다").apply {
            setProperty("code", CommonErrorCode.INTERNAL_SERVER_ERROR.code)
        }
    }
}