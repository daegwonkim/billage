package io.github.daegwonkim.backend.exception.base

abstract class BaseException(
    override val message: String,
    val errorCode: ErrorCode,
    override val cause: Throwable? = null
) : RuntimeException(message, cause)