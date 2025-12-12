package io.github.daegwonkim.backend.exception

import io.github.daegwonkim.backend.exception.base.InfrastructureException
import io.github.daegwonkim.backend.exception.data.ErrorCode

class ExternalServiceException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : InfrastructureException(errorCode, cause)