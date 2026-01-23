package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant

@Entity
@Table(name = "chat_participants")
@EntityListeners(AuditingEntityListener::class)
class ChatParticipant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "chat_room_id", nullable = false, updatable = false)
    val chatRoomId: Long,

    @Column(name = "user_id", nullable = false, updatable = false)
    val userId: Long,

    @Column(name = "last_read_message_id")
    var lastReadMessageId: Long? = null,

    @Column(name = "left_at")
    var leftAt: Instant? = null
) {
    @CreatedDate
    @Column(name = "joined_at", nullable = false, updatable = false)
    lateinit var joinedAt: Instant
}