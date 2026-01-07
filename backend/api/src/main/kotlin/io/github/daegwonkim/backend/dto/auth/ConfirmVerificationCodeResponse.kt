package io.github.daegwonkim.backend.dto.auth

import java.util.UUID

data class ConfirmVerificationCodeResponse(
    val verifiedToken: UUID
)
