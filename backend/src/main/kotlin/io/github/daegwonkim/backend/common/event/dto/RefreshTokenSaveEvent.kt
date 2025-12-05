package io.github.daegwonkim.backend.common.event.dto

import java.util.UUID

data class RefreshTokenSaveEvent(
    val userId: UUID,
    val refreshToken: String
)
