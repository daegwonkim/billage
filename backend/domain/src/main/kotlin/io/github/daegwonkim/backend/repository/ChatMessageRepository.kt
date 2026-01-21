package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.ChatMessage
import org.springframework.data.jpa.repository.JpaRepository

interface ChatMessageRepository : JpaRepository<ChatMessage, Long> {
    fun findAllByChatRoomId(chatRoomId: Long): List<ChatMessage>
}