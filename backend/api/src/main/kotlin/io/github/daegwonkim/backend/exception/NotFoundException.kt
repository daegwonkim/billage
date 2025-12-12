package io.github.daegwonkim.backend.exception

import io.github.daegwonkim.backend.exception.base.BusinessException
import io.github.daegwonkim.backend.exception.data.ErrorCode

class NotFoundException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)