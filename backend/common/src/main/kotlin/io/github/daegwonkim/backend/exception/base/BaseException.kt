package io.github.daegwonkim.backend.exception.base

import io.github.daegwonkim.backend.exception.base.errorcode.ErrorCode

abstract class BaseException(
    val errorCode: ErrorCode,
    override val message: String,
    override val cause: Throwable? = null
) : RuntimeException(message, cause)