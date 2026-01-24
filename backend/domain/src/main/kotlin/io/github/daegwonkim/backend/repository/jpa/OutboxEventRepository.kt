package io.github.daegwonkim.backend.repository.jpa

import io.github.daegwonkim.backend.entity.OutboxEvent
import io.github.daegwonkim.backend.enumerate.OutboxEventStatus
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant

interface OutboxEventRepository : JpaRepository<OutboxEvent, Long> {
    fun findByStatus(status: OutboxEventStatus): List<OutboxEvent>
    fun deleteByStatusAndPublishedAtBefore(status: OutboxEventStatus, before: Instant)
}
