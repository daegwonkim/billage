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
@Table(name = "chat_messages")
@EntityListeners(AuditingEntityListener::class)
class ChatMessage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "chat_room_id", nullable = false, updatable = false)
    val chatRoomId: Long,

    @Column(name = "sender_id", nullable = false, updatable = false)
    val senderId: Long,

    @Column(nullable = false, updatable = false)
    val content: String
) {
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    lateinit var createdAt: Instant
}