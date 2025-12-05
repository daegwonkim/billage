package io.github.daegwonkim.backend.event

import java.util.UUID

data class RefreshTokenDeleteEvent(
    val userId: UUID
)
