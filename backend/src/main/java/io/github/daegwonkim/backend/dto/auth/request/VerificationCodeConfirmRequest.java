package io.github.daegwonkim.backend.dto.auth.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerificationCodeConfirmRequest(
        // 전화번호는 반드시 01로 시작해야 하며, 하이픈은 포함하지 않는다.
        @NotBlank(message = "전화번호는 필수입니다")
        @Pattern(regexp = "^01[0-9]{8,9}$", message = "올바른 전화번호 형식이 아닙니다")
        String phoneNo,

        @NotBlank(message = "인증번호는 필수입니다")
        @Pattern(regexp = "^\\d{6}$", message = "인증번호는 6자리 숫자입니다")
        String verificationCode
) {
}
