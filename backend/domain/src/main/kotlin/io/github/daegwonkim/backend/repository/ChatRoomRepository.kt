package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.ChatRoom
import org.springframework.data.jpa.repository.JpaRepository

interface ChatRoomRepository : JpaRepository<ChatRoom, Long> {
}