package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import io.github.daegwonkim.backend.jooq.Tables.CHAT_ROOMS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class ChatRoomJooqRepository(
    private val dslContext: DSLContext
) {
    fun findChatRoomByRentalItemIdAndParticipantIds(rentalItemId: Long, participantIds: List<Long>): Long? {
        return dslContext.select(CHAT_ROOMS.ID)
            .from(CHAT_ROOMS)
            .innerJoin(CHAT_PARTICIPANTS).on(CHAT_ROOMS.ID.eq(CHAT_PARTICIPANTS.CHAT_ROOM_ID))
            .where(CHAT_ROOMS.RENTAL_ITEM_ID.eq(rentalItemId))
            .and(CHAT_PARTICIPANTS.USER_ID.`in`(participantIds))
            .and(CHAT_PARTICIPANTS.LEFT_AT.isNull)
            .groupBy(CHAT_ROOMS.ID)
            .having(DSL.count(CHAT_PARTICIPANTS.USER_ID).eq(participantIds.size))
            .fetchOneInto(Long::class.java)
    }
}