package io.github.daegwonkim.backend.repository.jooq

import io.github.daegwonkim.backend.jooq.Tables.CHAT_MESSAGES
import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import io.github.daegwonkim.backend.jooq.Tables.CHAT_ROOMS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEMS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_IMAGES
import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.ChatRoomProjection
import io.github.daegwonkim.backend.repository.projection.ChatRoomUpdateStatusProjection
import io.github.daegwonkim.backend.repository.projection.ChatRoomsProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.concat
import org.jooq.impl.DSL.value
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class ChatRoomJooqRepository(
    private val dslContext: DSLContext
) {
    fun findChatRoomIdByRentalItemIdAndParticipantIds(rentalItemId: Long, participantIds: List<Long>): Long? {
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

    fun findChatRoomById(id: Long): ChatRoomProjection? {
        val thumbnailImageKey = thumbnailImageKeyLateral()

        return dslContext.select(
            CHAT_ROOMS.ID.`as`("chat_room_id"),
            RENTAL_ITEMS.ID.`as`("rental_item_id"),
            RENTAL_ITEMS.CATEGORY.`as`("rental_item_category"),
            RENTAL_ITEMS.TITLE.`as`("rental_item_title"),
            RENTAL_ITEMS.PRICE_PER_DAY.`as`("rental_item_price_per_day"),
            RENTAL_ITEMS.PRICE_PER_WEEK.`as`("rental_item_price_per_week"),
            RENTAL_ITEMS.SELLER_ID,
            USERS.NICKNAME.`as`("seller_nickname"),
            USERS.PROFILE_IMAGE_KEY.`as`("seller_profile_image_key"),
            thumbnailImageKey.field("rental_item_thumbnail_image_key", String::class.java),
            addressField()
            )
            .from(CHAT_ROOMS)
            .innerJoin(RENTAL_ITEMS).on(CHAT_ROOMS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .innerJoin(USERS).on(RENTAL_ITEMS.SELLER_ID.eq(USERS.ID))
            .innerJoin(USER_NEIGHBORHOODS).on(USERS.ID.eq(USER_NEIGHBORHOODS.USER_ID))
            .innerJoin(NEIGHBORHOODS).on(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID.eq(NEIGHBORHOODS.ID))
            .innerJoin(thumbnailImageKey).on(DSL.trueCondition())
            .where(CHAT_ROOMS.ID.eq(id))
            .fetchOneInto(ChatRoomProjection::class.java)
    }

    fun findChatRoomsByUserId(userId: Long): List<ChatRoomsProjection> {
        val thumbnailImageKey = thumbnailImageKeyLateral()
        val latestMessage = latestMessageLateral()
        val unreadCount = unreadCountLateral()

        return dslContext.select(
                CHAT_ROOMS.ID,
                USERS.NICKNAME.`as`("chat_participant_nickname"),
                RENTAL_ITEMS.TITLE.`as`("rental_item_title"),
                thumbnailImageKey.field("rental_item_thumbnail_image_key", String::class.java),
                latestMessage.field("latest_message", String::class.java),
                latestMessage.field("latest_message_time", Instant::class.java),
                unreadCount.field("unread_count", Int::class.java)
            )
            .from(CHAT_ROOMS)
            .innerJoin(CHAT_PARTICIPANTS).on(CHAT_ROOMS.ID.eq(CHAT_PARTICIPANTS.CHAT_ROOM_ID))
            .innerJoin(RENTAL_ITEMS).on(CHAT_ROOMS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .innerJoin(USERS).on(RENTAL_ITEMS.SELLER_ID.eq(USERS.ID))
            .innerJoin(latestMessage).on(DSL.trueCondition())
            .innerJoin(thumbnailImageKey).on(DSL.trueCondition())
            .innerJoin(unreadCount).on(DSL.trueCondition())
            .where(CHAT_PARTICIPANTS.USER_ID.eq(userId))
            .and(CHAT_PARTICIPANTS.LEFT_AT.isNull)
            .orderBy(latestMessage.field("latest_message_time")?.desc())
            .fetchInto(ChatRoomsProjection::class.java)
    }

    fun findChatRoomUpdateStatus(chatRoomId: Long, chatParticipantUserId: Long): ChatRoomUpdateStatusProjection? {
        val latestMessage = latestMessageLateral()

        return dslContext.select(
            latestMessage.field("latest_message", String::class.java),
            latestMessage.field("latest_message_time", Instant::class.java),
            DSL.count(CHAT_MESSAGES.ID).`as`("unread_count")
            )
            .from(CHAT_ROOMS)
            .innerJoin(CHAT_PARTICIPANTS).on(CHAT_ROOMS.ID.eq(CHAT_PARTICIPANTS.CHAT_ROOM_ID))
            .innerJoin(latestMessage).on(DSL.trueCondition())
            .leftJoin(CHAT_MESSAGES).on(CHAT_ROOMS.ID.eq(CHAT_MESSAGES.CHAT_ROOM_ID)
                .and(CHAT_MESSAGES.ID.gt(DSL.coalesce(CHAT_PARTICIPANTS.LAST_READ_MESSAGE_ID, 0)))
                .and(CHAT_MESSAGES.SENDER_ID.ne(CHAT_PARTICIPANTS.USER_ID)))
            .where(CHAT_ROOMS.ID.eq(chatRoomId)
                .and(CHAT_PARTICIPANTS.USER_ID.eq(chatParticipantUserId)))
            .groupBy(latestMessage.field("latest_message"), latestMessage.field("latest_message_time"))
            .fetchOneInto(ChatRoomUpdateStatusProjection::class.java)
    }

    private fun thumbnailImageKeyLateral() =
        DSL.lateral(
            dslContext.select(RENTAL_ITEM_IMAGES.KEY.`as`("rental_item_thumbnail_image_key"))
                .from(RENTAL_ITEM_IMAGES)
                .where(RENTAL_ITEM_IMAGES.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
                .orderBy(RENTAL_ITEM_IMAGES.SEQUENCE.asc())
                .limit(1)
        )

    private fun latestMessageLateral() =
        DSL.lateral(
            dslContext.select(
                CHAT_MESSAGES.CONTENT.`as`("latest_message"),
                CHAT_MESSAGES.CREATED_AT.`as`("latest_message_time")
                )
                .from(CHAT_MESSAGES)
                .where(CHAT_MESSAGES.CHAT_ROOM_ID.eq(CHAT_ROOMS.ID))
                .orderBy(CHAT_MESSAGES.CREATED_AT.desc())
                .limit(1)
        )

    private fun unreadCountLateral() =
        DSL.lateral(
            dslContext.select(DSL.count().`as`("unread_count"))
                .from(CHAT_MESSAGES)
                .where(CHAT_MESSAGES.CHAT_ROOM_ID.eq(CHAT_ROOMS.ID))
                .and(CHAT_MESSAGES.ID.gt(DSL.coalesce(CHAT_PARTICIPANTS.LAST_READ_MESSAGE_ID, 0)))
                .and(CHAT_MESSAGES.SENDER_ID.ne(CHAT_PARTICIPANTS.USER_ID))
        )

    private fun addressField() =
        concat(
            NEIGHBORHOODS.SIGUNGU, value(" "),
            NEIGHBORHOODS.EUPMYEONDONG,
        ).`as`("seller_address")
}