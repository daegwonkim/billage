package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.UserProfileProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class UserJooqRepository(
    private val dslContext: DSLContext
) {
    fun findUserProfile(userId: Long): UserProfileProjection? {
        return dslContext.select(
            USERS.ID,
            USERS.PUBLIC_ID,
            USERS.NICKNAME,
            USERS.PROFILE_IMAGE_KEY,
            USERS.LAST_ACTIVE_AT,
            USERS.NEIGHBORHOOD_VERIFIED_AT,
            USERS.RENT_OUT_COUNT,
            USERS.RENT_IN_COUNT,
            USERS.CREATED_AT,
            NEIGHBORHOODS.SIDO,
            NEIGHBORHOODS.SIGUNGU,
            NEIGHBORHOODS.EUPMYEONDONG
        ).from(USERS)
            .join(USER_NEIGHBORHOODS).on(USERS.ID.eq(USER_NEIGHBORHOODS.USER_ID))
            .join(NEIGHBORHOODS).on(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID.eq(NEIGHBORHOODS.ID))
            .where(USERS.ID.eq(userId))
            .fetchOneInto(UserProfileProjection::class.java)
    }

    fun updateLastActiveAtByUserId(userId: Long) {
        dslContext.update(USERS)
            .set(USERS.LAST_ACTIVE_AT, DSL.currentOffsetDateTime())
            .where(USERS.ID.eq(userId))
            .execute()
    }

    fun updateNeighborhoodVerifiedAtByUserId(userId: Long) {
        dslContext.update(USERS)
            .set(USERS.NEIGHBORHOOD_VERIFIED_AT, DSL.currentOffsetDateTime())
            .where(USERS.ID.eq(userId))
            .execute()
    }
}