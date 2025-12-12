package io.github.daegwonkim.backend.redis.event.dto

import java.util.UUID

data class RefreshTokenDeleteEvent(
    val userId: UUID
)
