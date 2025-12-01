package io.github.daegwonkim.backend.dto.auth.request;

import io.github.daegwonkim.backend.enumerate.auth.Carrier;

public record VerificationCodeSendRequest(
        String name,
        String birth,
        int gender,
        Carrier carrier,
        String phoneNumber
) {
}
