package io.github.daegwonkim.backend.event.dto

data class OutboxPublishEvent(
    val outboxEventId: Long
)
