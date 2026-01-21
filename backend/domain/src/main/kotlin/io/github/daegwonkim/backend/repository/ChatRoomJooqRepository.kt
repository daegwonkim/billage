package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.Tables.CHAT_PARTICIPANTS
import io.github.daegwonkim.backend.jooq.Tables.CHAT_ROOMS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEMS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_IMAGES
import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.ChatRoomProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.concat
import org.jooq.impl.DSL.value
import org.springframework.stereotype.Repository

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
        return dslContext.select(
            CHAT_ROOMS.ID.`as`("chat_room_id"),
            RENTAL_ITEMS.ID.`as`("rental_item_id"),
            RENTAL_ITEMS.CATEGORY.`as`("rental_item_category"),
            RENTAL_ITEMS.TITLE.`as`("rental_item_title"),
            RENTAL_ITEMS.PRICE_PER_DAY.`as`("rental_item_price_per_day"),
            RENTAL_ITEMS.PRICE_PER_WEEK.`as`("rental_item_price_per_week"),
            USERS.ID.`as`("seller_id"),
            USERS.NICKNAME.`as`("seller_nickname"),
            USERS.PROFILE_IMAGE_KEY.`as`("seller_profile_image_key"),
            addressField(),
            thumbnailImageUrlSubquery()
            )
            .from(CHAT_ROOMS)
            .innerJoin(RENTAL_ITEMS).on(CHAT_ROOMS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .innerJoin(USERS).on(RENTAL_ITEMS.USER_ID.eq(USERS.ID))
            .innerJoin(USER_NEIGHBORHOODS).on(USERS.ID.eq(USER_NEIGHBORHOODS.USER_ID))
            .innerJoin(NEIGHBORHOODS).on(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID.eq(NEIGHBORHOODS.ID))
            .where(CHAT_ROOMS.ID.eq(id))
            .fetchOneInto(ChatRoomProjection::class.java)
    }

    private fun thumbnailImageUrlSubquery() =
        dslContext.select(RENTAL_ITEM_IMAGES.KEY)
            .from(RENTAL_ITEM_IMAGES)
            .where(RENTAL_ITEM_IMAGES.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .orderBy(RENTAL_ITEM_IMAGES.SEQUENCE.asc())
            .limit(1)
            .asField<String>("rental_item_thumbnail_image_key")

    private fun addressField() =
        concat(
            NEIGHBORHOODS.SIGUNGU, value(" "),
            NEIGHBORHOODS.EUPMYEONDONG,
        ).`as`("seller_address")
}