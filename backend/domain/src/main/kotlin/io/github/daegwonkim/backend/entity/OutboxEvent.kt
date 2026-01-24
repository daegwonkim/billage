package io.github.daegwonkim.backend.entity

import io.github.daegwonkim.backend.enumerate.OutboxEventStatus
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant

@Entity
@Table(name = "outbox_events")
class OutboxEvent(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "aggregate_type", nullable = false, updatable = false)
    val aggregateType: String,

    @Column(name = "aggregate_id", nullable = false, updatable = false)
    val aggregateId: String,

    @Column(name = "event_type", nullable = false, updatable = false)
    val eventType: String,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, updatable = false, columnDefinition = "jsonb")
    val payload: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OutboxEventStatus = OutboxEventStatus.PENDING,

    @Column(name = "retry_count", nullable = false)
    var retryCount: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "published_at")
    var publishedAt: Instant? = null
) {
    fun markPublished() {
        status = OutboxEventStatus.PUBLISHED
        publishedAt = Instant.now()
    }
}
