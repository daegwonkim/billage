package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalStatus
import io.github.daegwonkim.backend.jooq.generated.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.generated.Tables.RENTAL_ITEMS
import io.github.daegwonkim.backend.jooq.generated.Tables.RENTAL_ITEM_IMAGES
import io.github.daegwonkim.backend.jooq.generated.Tables.RENTAL_ITEM_LIKE_RECORDS
import io.github.daegwonkim.backend.jooq.generated.Tables.RENTAL_RECORDS
import io.github.daegwonkim.backend.jooq.generated.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.dto.SearchedRentalItem
import org.jooq.DSLContext
import org.jooq.Field
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
    fun searchRentalItems(
        category: RentalItemCategory?,
        keyword: String?,
        pageable: Pageable
    ): Page<SearchedRentalItem> {
        val baseQuery = dslContext.select(
            RENTAL_ITEMS.ID,
            RENTAL_ITEMS.TITLE,
            RENTAL_ITEMS.PRICE_PER_DAY,
            RENTAL_ITEMS.PRICE_PER_WEEK,
            RENTAL_ITEMS.CREATED_AT,
            thumbnailUrlSubquery(),
            rentalCountSubquery(),
            likeCountSubquery(),
            addressField())
            .from(RENTAL_ITEMS)
            .leftJoin(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .leftJoin(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(buildSearchRentalItemsCondition(category = category, keyword = keyword))
            .orderBy(buildSortOrder(pageable = pageable))

        val totalCount = dslContext.selectCount()
            .from(RENTAL_ITEMS)
            .leftJoin(USER_NEIGHBORHOODS).on(USER_NEIGHBORHOODS.USER_ID.eq(RENTAL_ITEMS.USER_ID))
            .leftJoin(NEIGHBORHOODS).on(NEIGHBORHOODS.ID.eq(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID))
            .where(buildSearchRentalItemsCondition(category = category, keyword = keyword))
            .fetchOne(0, Long::class.java) ?: 0L

        val results = baseQuery
            .limit(pageable.pageSize)
            .offset(pageable.offset)
            .fetchInto(SearchedRentalItem::class.java)

        return PageImpl(results, pageable, totalCount)
    }

    private fun thumbnailUrlSubquery() =
        dslContext.select(buildSupabaseStorageUrl(name = RENTAL_ITEM_IMAGES.NAME))
            .from(RENTAL_ITEM_IMAGES)
            .where(RENTAL_ITEM_IMAGES.RENTAL_ITEM_ID.eq(RENTAL_ITEMS.ID))
            .orderBy(RENTAL_ITEM_IMAGES.SEQUENCE.asc())
            .limit(1)
            .asField<String>("thumbnailUrl")

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

    private fun addressField() =
        concat(
            NEIGHBORHOODS.SIDO, value(" "),
            NEIGHBORHOODS.SIGUNGU, value(" "),
            NEIGHBORHOODS.EUPMYEONDONG,
        ).`as`("address")

    private fun buildSearchRentalItemsCondition(category: RentalItemCategory?, keyword: String?) =
        listOfNotNull(
            category?.let { RENTAL_ITEMS.CATEGORY.eq(it.name) },
            keyword?.takeIf { it.isNotBlank() }?.let {
                lower(RENTAL_ITEMS.TITLE).like("%${it.lowercase()}%")
            }
        ).let {
            if (it.isEmpty()) noCondition()
            else it.reduce { acc, condition -> acc.and(condition) }
        }

    private fun buildSortOrder(pageable: Pageable) =
        pageable.sort.firstOrNull()?.let { sort ->
            val field = when (sort.property) {
                "createdAt" -> RENTAL_ITEMS.CREATED_AT
                else -> RENTAL_ITEMS.CREATED_AT
            }
            if (sort.isAscending) field.asc() else field.desc()
        } ?: RENTAL_ITEMS.CREATED_AT.desc()

    private fun buildSupabaseStorageUrl(name: Field<String>) =
        concat(DSL.value("$supabaseUrl/storage/v1/object/public/rental-item"), name)
}