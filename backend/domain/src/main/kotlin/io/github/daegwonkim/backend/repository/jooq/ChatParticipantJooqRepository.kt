package io.github.daegwonkim.backend.repository.jooq

import io.github.daegwonkim.backend.jooq.Tables.CHAT_MESSAGES
import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import org.jooq.DSLContext
import org.jooq.impl.DSL
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

    fun updateLastReadMessageId(chatRoomId: Long, userId: Long) {
        dslContext.update(CHAT_PARTICIPANTS)
            .set(
                CHAT_PARTICIPANTS.LAST_READ_MESSAGE_ID,
                dslContext.select(DSL.max(CHAT_MESSAGES.ID))
                    .from(CHAT_MESSAGES)
                    .where(CHAT_MESSAGES.CHAT_ROOM_ID.eq(chatRoomId))
            )
            .where(CHAT_PARTICIPANTS.CHAT_ROOM_ID.eq(chatRoomId))
            .and(CHAT_PARTICIPANTS.USER_ID.eq(userId))
            .execute()
    }
}