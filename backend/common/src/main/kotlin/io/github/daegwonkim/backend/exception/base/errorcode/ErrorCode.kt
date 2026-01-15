package io.github.daegwonkim.backend.exception.base.errorcode

import org.springframework.http.HttpStatus

interface ErrorCode {
    val code: String
    val message: String
    val status: HttpStatus
}