package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class ResourceNotFoundException(
    val domainName: String,
    val identifier: String? = null
) : BusinessException(
    message = if (identifier != null) "$domainName($identifier)을/를 찾을 수 없습니다"
              else "${identifier}을/를 찾을 수 없습니다",
    errorCode = ErrorCode.RESOURCE_NOT_FOUND
) {
    constructor(domainName: String, id: Long) : this(domainName, "id=$id")
}