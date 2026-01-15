package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.errorcode.ErrorCode

class ResourceNotFoundException(
    resourceId: Long,
    errorCode: ErrorCode,
) : BusinessException(
    errorCode = errorCode,
    logMessage = "존재하지 않는 리소스에 대한 요청 발생: $resourceId"
)