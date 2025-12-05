package io.github.daegwonkim.backend.common.event.dto

import java.util.UUID

data class RefreshTokenDeleteEvent(
    val userId: UUID
)
