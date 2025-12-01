package io.github.daegwonkim.backend.dto.auth.request;

public record CodeVerificationRequest(
        String phoneNumber,
        String verificationCode
) {
}
