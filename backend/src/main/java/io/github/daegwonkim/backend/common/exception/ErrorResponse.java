package io.github.daegwonkim.backend.common.exception;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ErrorResponse(
        int code,
        String message,
        LocalDateTime timestamp,
        String path,

        // 유효성 검증 실패 시 필드별 에러
        List<FieldError> errors
) {
    public record FieldError(
            String field,
            String value,
            String reason
    ) {}

    // 기본 에러 응답
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                LocalDateTime.now(),
                path,
                null
        );
    }

    // Validation 에러 응답
    public static ErrorResponse of(ErrorCode errorCode, String path, List<FieldError> errors) {
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                LocalDateTime.now(),
                path,
                errors
        );
    }
}
