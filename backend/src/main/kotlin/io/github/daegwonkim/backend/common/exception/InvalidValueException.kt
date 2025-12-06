package io.github.daegwonkim.backend.common.exception

import io.github.daegwonkim.backend.common.exception.base.BusinessException
import io.github.daegwonkim.backend.common.exception.data.ErrorCode

class InvalidValueException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)