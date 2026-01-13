package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.Tables.USERS
import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.jooq.Tables.USER_NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.GetMeProjection
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class UserJooqRepository(
    private val dslContext: DSLContext
) {
    fun getMe(userId: Long): GetMeProjection? {
        return dslContext.select(
            USERS.NICKNAME,
            USERS.PROFILE_IMAGE_KEY,
            NEIGHBORHOODS.SIDO,
            NEIGHBORHOODS.SIGUNGU,
            NEIGHBORHOODS.EUPMYEONDONG
        ).from(USERS)
            .join(USER_NEIGHBORHOODS).on(USERS.ID.eq(USER_NEIGHBORHOODS.USER_ID))
            .join(NEIGHBORHOODS).on(USER_NEIGHBORHOODS.NEIGHBORHOOD_ID.eq(NEIGHBORHOODS.ID))
            .where(USERS.ID.eq(userId))
            .fetchOneInto(GetMeProjection::class.java)
    }
}