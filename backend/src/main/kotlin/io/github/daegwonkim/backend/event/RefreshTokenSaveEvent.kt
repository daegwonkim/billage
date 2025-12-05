package io.github.daegwonkim.backend.event

import java.util.UUID

data class RefreshTokenSaveEvent(
    val userId: UUID,
    val refreshToken: String
)
