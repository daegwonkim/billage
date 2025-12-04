package io.github.daegwonkim.backend.common.exception

import java.lang.RuntimeException

abstract class BusinessException(
    val errorCode: ErrorCode,
    cause: Throwable? = null
) : RuntimeException(errorCode.message, cause)