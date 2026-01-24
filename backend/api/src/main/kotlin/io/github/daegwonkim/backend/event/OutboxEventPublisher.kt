package io.github.daegwonkim.backend.event

import io.github.daegwonkim.backend.entity.OutboxEventStatus
import io.github.daegwonkim.backend.event.dto.OutboxPublishEvent
import io.github.daegwonkim.backend.log.logger
import io.github.daegwonkim.backend.repository.jpa.OutboxEventRepository
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener
import java.time.Instant
import java.time.temporal.ChronoUnit

@Component
class OutboxEventPublisher(
    private val outboxEventRepository: OutboxEventRepository,
    private val rabbitTemplate: RabbitTemplate,
    @Value($$"${chat.exchange-name}")
    private val exchangeName: String,
    @Value($$"${outbox.max-retry-count:5}")
    private val maxRetryCount: Int,
    @Value($$"${outbox.cleanup-older-than-hours:1}")
    private val cleanupOlderThanHours: Long
) {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun handleOutboxPublishEvent(event: OutboxPublishEvent) {
        try {
            val outboxEvent = outboxEventRepository.findById(event.outboxEventId).orElse(null) ?: return
            if (outboxEvent.status != OutboxEventStatus.PENDING) return

            rabbitTemplate.convertAndSend(exchangeName, "", outboxEvent.payload)
            outboxEvent.markPublished()
            outboxEventRepository.save(outboxEvent)
        } catch (e: Exception) {
            logger.warn(e) { "즉시 발행 실패 (outboxEventId=${event.outboxEventId}), 스케줄러에서 재시도 예정" }
        }
    }

    @Scheduled(fixedDelayString = $$"${outbox.poll-interval-ms:5000}")
    @SchedulerLock(name = "outbox-poll", lockAtMostFor = "PT25S", lockAtLeastFor = "PT4S")
    @Transactional
    fun pollPendingEvents() {
        val pendingEvents = outboxEventRepository.findByStatus(OutboxEventStatus.PENDING)
        for (event in pendingEvents) {
            if (event.retryCount >= maxRetryCount) {
                logger.error { "최대 재시도 횟수 초과 (outboxEventId=${event.id}, retryCount=${event.retryCount})" }
                continue
            }
            try {
                rabbitTemplate.convertAndSend(exchangeName, "", event.payload)
                event.markPublished()
            } catch (e: Exception) {
                event.retryCount++
                logger.warn(e) { "Outbox 폴링 발행 실패 (outboxEventId=${event.id}, retryCount=${event.retryCount})" }
            }
            outboxEventRepository.save(event)
        }
    }

    @Scheduled(fixedRate = 3600000)
    @SchedulerLock(name = "outbox-cleanup", lockAtMostFor = "PT5M", lockAtLeastFor = "PT30S")
    @Transactional
    fun cleanupPublishedEvents() {
        val cutoff = Instant.now().minus(cleanupOlderThanHours, ChronoUnit.HOURS)
        outboxEventRepository.deleteByStatusAndPublishedAtBefore(OutboxEventStatus.PUBLISHED, cutoff)
    }
}
