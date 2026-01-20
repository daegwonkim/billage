package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.ChatParticipant
import org.springframework.data.jpa.repository.JpaRepository

interface ChatParticipantJpaRepository : JpaRepository<ChatParticipant, Long> {
}