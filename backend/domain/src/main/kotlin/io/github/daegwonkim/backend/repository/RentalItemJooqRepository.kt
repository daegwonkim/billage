package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption
import io.github.daegwonkim.backend.enumerate.RentalStatus
import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEMS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_IMAGES
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_ITEM_LIKE_RECORDS
import io.github.daegwonkim.backend.jooq.Tables.RENTAL_RECORDS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.GetOtherRentalItemsBySellerItemProjection
import io.github.daegwonkim.backend.repository.projection.GetRentalItemProjection
import io.github.daegwonkim.backend.repository.projection.GetRentalItemsProjection
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
    fun getRentalItems(
        category: RentalItemCategory?,
        keyword: String?,
        sortBy: RentalItemSortOption,
        pageable: Pageable
    ): Page<GetRentalItemsProjection> {
        val baseQuery = dslContext.select(
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.TITLE,
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK,
            RENTAL_ITEMS.VIEW_COUNT,
            RENTAL_ITEMS.CREATED_AT,
            thumbnailImageUrlSubquery(),
            rentalCountSubquery(),
            likeCountSubquery(),
            addressField())
            .from(RENTAL_ITEMS)
            .join(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .join(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(buildGetRentalItemsCondition(category = category, keyword = keyword))
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
            .fetchInto(GetRentalItemsProjection::class.java)

        return PageImpl(results, pageable, totalCount)
    }

    fun getRentalItem(rentalItemId: Long, userId: Long?): GetRentalItemProjection? {
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
            rentalCountSubquery(),
            likeCountSubquery(),
            addressField(),
            likedSubquery(userId = userId))
            .from(RENTAL_ITEMS)
            .join(USERS).on(USERS.ID.eq(RENTAL_ITEMS.USER_ID))
            .join(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .join(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(RENTAL_ITEMS.ID.eq(rentalItemId))
            .fetchOneInto(GetRentalItemProjection::class.java)
    }

    fun getOtherRentalItemsBySeller(
        rentalItemId: Long,
        sellerId: Long
    ): List<GetOtherRentalItemsBySellerItemProjection> {
        return dslContext.select(
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.TITLE,
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK,
            thumbnailImageUrlSubquery())
            .from(RENTAL_ITEMS)
            .join(USERS).on(USERS.ID.eq(RENTAL_ITEMS.USER_ID))
            .where(RENTAL_ITEMS.ID.ne(rentalItemId)
                .and(USERS.ID.eq(sellerId)))
            .limit(10)
            .fetchInto(GetOtherRentalItemsBySellerItemProjection::class.java)
    }

    fun incrementViewCount(rentalItemId: Long): Int {
        return dslContext.update(RENTAL_ITEMS)
            .set(RENTAL_ITEMS.VIEW_COUNT, RENTAL_ITEMS.VIEW_COUNT.plus(1))
            .where(RENTAL_ITEMS.ID.eq(rentalItemId))
            .execute()
    }

    private fun thumbnailImageUrlSubquery() =
        dslContext.select(RENTAL_ITEM_IMAGES.KEY)
            .from(RENTAL_ITEM_IMAGES)
            .where(RENTAL_ITEM_IMAGES.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .orderBy(RENTAL_ITEM_IMAGES.SEQUENCE.asc())
            .limit(1)
            .asField<String>("thumbnail_image_key")

    private fun rentalCountSubquery() =
        dslContext.selectCount()
            .from(RENTAL_RECORDS)
            .where(RENTAL_RECORDS.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID)
                .and(RENTAL_RECORDS.STATUS.eq(RentalStatus.RETURNED.name)))
            .asField<Int>("rental_count")

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