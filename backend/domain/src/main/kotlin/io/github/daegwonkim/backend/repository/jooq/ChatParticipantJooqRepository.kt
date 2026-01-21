package io.github.daegwonkim.backend.repository.jooq

import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class ChatParticipantJooqRepository(
    private val dslContext: DSLContext
) {
    fun checkParticipant(chatRoomId: Long, userId: Long): Boolean {
        val participant = dslContext.selectCount()
            .from(CHAT_PARTICIPANTS)
            .where(CHAT_PARTICIPANTS.CHAT_ROOM_ID.eq(chatRoomId))
            .and(CHAT_PARTICIPANTS.USER_ID.eq(userId))
            .and(CHAT_PARTICIPANTS.LEFT_AT.isNull)
            .execute()

        return participant > 0
    }
}