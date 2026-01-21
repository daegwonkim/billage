package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption
import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEMS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_IMAGES
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_LIKE_RECORDS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.RentalItemProjection
import io.github.daegwonkim.backend.repository.projection.RentalItemsProjection
import io.github.daegwonkim.backend.repository.projection.UserRentalItemsProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.concat
import org.jooq.impl.DSL.lower
import org.jooq.impl.DSL.noCondition
import org.jooq.impl.DSL.value
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository

@Repository
class RentalItemJooqRepository(
    private val dslContext: DSLContext,
    @Value($$"${supabase.url}")
    private val supabaseUrl: String
) {
    fun findRentalItems(
        userId: Long?,
        category: RentalItemCategory?,
        keyword: String?,
        sortBy: RentalItemSortOption,
        pageable: Pageable
    ): Page<RentalItemsProjection> {
        val baseQuery = dslContext.select(
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.USER_ID.`as`("seller_id"),
            RENTAL_ITEMS.TITLE,
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK,
            RENTAL_ITEMS.VIEW_COUNT,
            RENTAL_ITEMS.CREATED_AT,
            thumbnailImageUrlSubquery(),
            likeCountSubquery(),
            addressField(),
            likedSubquery(userId))
            .from(RENTAL_ITEMS)
            .join(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .join(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(buildGetRentalItemsCondition(category = category, keyword = keyword))
            .and(RENTAL_ITEMS.IS_DELETED.eq(false))
            .orderBy(buildSortOrder(sortBy))

        val totalCount = dslContext.selectCount()
            .from(RENTAL_ITEMS)
            .join(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .join(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(buildGetRentalItemsCondition(category = category, keyword = keyword))
            .fetchOne(0, Long::class.java) ?: 0L

        val results = baseQuery
            .limit(pageable.pageSize)
            .offset(pageable.offset)
            .fetchInto(RentalItemsProjection::class.java)

        return PageImpl(results, pageable, totalCount)
    }

    fun findRentalItem(rentalItemId: Long, userId: Long?): RentalItemProjection? {
        return dslContext.select(
            USERS.ID.`as`("seller_id"),
            USERS.NICKNAME.`as`("seller_nickname"),
            USERS.PROFILE_IMAGE_KEY.`as`("seller_profile_image_key"),
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.CATEGORY,
            RENTAL_ITEMS.TITLE,
            RENTAL_ITEMS.DESCRIPTION,
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK,
            RENTAL_ITEMS.VIEW_COUNT,
            RENTAL_ITEMS.CREATED_AT,
            likeCountSubquery(),
            addressField(),
            likedSubquery(userId = userId))
            .from(RENTAL_ITEMS)
            .join(USERS).on(USERS.ID.eq(RENTAL_ITEMS.USER_ID))
            .join(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .join(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(RENTAL_ITEMS.ID.eq(rentalItemId))
            .and(RENTAL_ITEMS.IS_DELETED.eq(false))
            .fetchOneInto(RentalItemProjection::class.java)
    }

    fun findRentalItemsByUserId(userId: Long, excludeRentalItemId: Long?): List<UserRentalItemsProjection> {
        return dslContext.select(
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.TITLE,
            thumbnailImageUrlSubquery(),
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK
        ).from(RENTAL_ITEMS)
            .where(RENTAL_ITEMS.USER_ID.eq(userId))
            .and(RENTAL_ITEMS.IS_DELETED.eq(false))
            .and(excludeRentalItemId?.let { RENTAL_ITEMS.ID.ne(it) } ?: DSL.noCondition())
            .fetchInto(UserRentalItemsProjection::class.java)
    }

    fun incrementViewCountById(rentalItemId: Long): Int {
        return dslContext.update(RENTAL_ITEMS)
            .set(RENTAL_ITEMS.VIEW_COUNT, RENTAL_ITEMS.VIEW_COUNT.plus(1))
            .where(RENTAL_ITEMS.ID.eq(rentalItemId))
            .execute()
    }

    fun updateIsDeletedById(id: Long, isDeleted: Boolean): Boolean {
        val deleted = dslContext.update(RENTAL_ITEMS)
            .set(RENTAL_ITEMS.IS_DELETED, isDeleted)
            .where(RENTAL_ITEMS.ID.eq(id))
            .execute()

        return deleted > 0
    }

    private fun thumbnailImageUrlSubquery() =
        dslContext.select(RENTAL_ITEM_IMAGES.KEY)
            .from(RENTAL_ITEM_IMAGES)
            .where(RENTAL_ITEM_IMAGES.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .orderBy(RENTAL_ITEM_IMAGES.SEQUENCE.asc())
            .limit(1)
            .asField<String>("thumbnail_image_key")

    private fun likeCountSubquery() =
        dslContext.selectCount()
            .from(RENTAL_ITEM_LIKE_RECORDS)
            .where(RENTAL_ITEM_LIKE_RECORDS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .asField<Int>("like_count")

    private fun likedSubquery(userId: Long?) =
        if (userId != null) {
            DSL.exists(
                dslContext.selectOne()
                    .from(RENTAL_ITEM_LIKE_RECORDS)
                    .where(RENTAL_ITEM_LIKE_RECORDS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID)
                        .and(RENTAL_ITEM_LIKE_RECORDS.USER_ID.eq(userId)))
            ).`as`("liked")
        } else {
            DSL.`val`(false).`as`("liked")
        }

    private fun addressField() =
        concat(
            NEIGHBORHOODS.SIGUNGU, value(" "),
            NEIGHBORHOODS.EUPMYEONDONG,
        ).`as`("address")

    private fun buildGetRentalItemsCondition(category: RentalItemCategory?, keyword: String?) =
        listOfNotNull(
            category?.let { RENTAL_ITEMS.CATEGORY.eq(it.name) },
            keyword?.takeIf { it.isNotBlank() }?.let {
                lower(RENTAL_ITEMS.TITLE).like("%${it.lowercase()}%")
            }
        ).let {
            if (it.isEmpty()) noCondition()
            else it.reduce { acc, condition -> acc.and(condition) }
        }

    private fun buildSortOrder(sortBy: RentalItemSortOption) = when (sortBy) {
        RentalItemSortOption.LATEST -> RENTAL_ITEMS.CREATED_AT.desc()
        RentalItemSortOption.POPULAR -> likeCountSubquery().desc()
        RentalItemSortOption.PRICE_LOW -> RENTAL_ITEMS.PRICE_PER_DAY.asc().nullsLast()
        RentalItemSortOption.PRICE_HIGH -> RENTAL_ITEMS.PRICE_PER_DAY.desc().nullsLast()
        RentalItemSortOption.NEAREST -> RENTAL_ITEMS.CREATED_AT.desc() // TODO: 위치 기반 정렬 구현 필요
    }
}