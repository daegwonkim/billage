package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class ResourceDuplicateException(
    val domainName: String,
    val field: String,
    val value: String
) : BusinessException(
    message = "${domainName}의 $field '$value'가/이 이미 존재합니다",
    errorCode = ErrorCode.RESOURCE_DUPLICATE
)