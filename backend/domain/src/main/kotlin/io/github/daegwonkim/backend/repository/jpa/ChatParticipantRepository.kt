package io.github.daegwonkim.backend.repository.jpa

import io.github.daegwonkim.backend.entity.ChatParticipant
import org.springframework.data.jpa.repository.JpaRepository

interface ChatParticipantRepository : JpaRepository<ChatParticipant, Long> {
}