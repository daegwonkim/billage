package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.ChatRoom
import org.springframework.data.jpa.repository.JpaRepository

interface ChatRoomJpaRepository : JpaRepository<ChatRoom, Long> {
}