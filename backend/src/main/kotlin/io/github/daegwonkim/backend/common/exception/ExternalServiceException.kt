package io.github.daegwonkim.backend.common.exception

import io.github.daegwonkim.backend.common.exception.base.InfrastructureException
import io.github.daegwonkim.backend.common.exception.data.ErrorCode

class ExternalServiceException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : InfrastructureException(errorCode, cause)