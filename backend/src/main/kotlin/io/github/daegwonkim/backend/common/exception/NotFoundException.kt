package io.github.daegwonkim.backend.common.exception

import io.github.daegwonkim.backend.common.exception.base.BusinessException
import io.github.daegwonkim.backend.common.exception.data.ErrorCode

class NotFoundException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)