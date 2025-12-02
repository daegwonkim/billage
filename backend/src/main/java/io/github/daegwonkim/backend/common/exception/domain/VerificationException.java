package io.github.daegwonkim.backend.common.exception.domain;

import io.github.daegwonkim.backend.common.exception.BusinessException;
import io.github.daegwonkim.backend.common.exception.ErrorCode;

public class VerificationException extends BusinessException {

    public VerificationException(ErrorCode errorCode) {
        super(errorCode);
    }

    public VerificationException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }
}
