package io.github.daegwonkim.backend.repository.jooq

import io.github.daegwonkim.backend.jooq.Tables.CHAT_MESSAGES
import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.repository.projection.ChatParticipantsProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class ChatParticipantJooqRepository(
    private val dslContext: DSLContext
) {
    fun findChatParticipantsByChatRoomId(chatRoomId: Long): List<ChatParticipantsProjection> {
        return dslContext.select(
            CHAT_PARTICIPANTS.USER_ID,
            USERS.NICKNAME,
            USERS.PROFILE_IMAGE_KEY
            )
            .from(CHAT_PARTICIPANTS)
            .innerJoin(USERS).on(CHAT_PARTICIPANTS.USER_ID.eq(USERS.ID))
            .where(CHAT_PARTICIPANTS.CHAT_ROOM_ID.eq(chatRoomId))
            .fetchInto(ChatParticipantsProjection::class.java)
    }

    fun updateLastReadMessageId(userId: Long, chatRoomId: Long) {
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

    fun updateLastReadMessageId(userId: Long, chatRoomId: Long, chatMessageId: Long) {
        dslContext.update(CHAT_PARTICIPANTS)
            .set(CHAT_PARTICIPANTS.LAST_READ_MESSAGE_ID, chatMessageId)
            .where(CHAT_PARTICIPANTS.CHAT_ROOM_ID.eq(chatRoomId))
            .and(CHAT_PARTICIPANTS.USER_ID.eq(userId))
            .execute()
    }
}