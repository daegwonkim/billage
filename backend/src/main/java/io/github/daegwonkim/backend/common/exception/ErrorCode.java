package io.github.daegwonkim.backend.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 1000번대: 공통 에러
    INVALID_INPUT_VALUE(1000, "잘못된 입력값입니다."),
    INTERNAL_SERVER_ERROR(1001, "서버 내부 오류가 발생했습니다."),

    // 2000번대: 인증 관련 에러
    VERIFICATION_CODE_NOT_FOUND(2000, "인증번호가 존재하지 않거나 만료되었습니다."),
    VERIFICATION_CODE_MISMATCH(2001, "인증번호가 일치하지 않습니다."),
    VERIFICATION_CODE_SEND_FAILED(2002, "인증번호 전송에 실패했습니다."),
    SMS_SEND_FAILED(2003, "SMS 전송에 실패했습니다.")
    ;

    private final int code;
    private final String message;
}
