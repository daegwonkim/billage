package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.generated.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.dto.Neighborhood
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class NeighborhoodJooqRepository(
    private val dslContext: DSLContext
) {
    fun findByCoordinate(latitude: Double, longitude: Double): Neighborhood? {
        return dslContext.select(
            NEIGHBORHOODS.ID,
            NEIGHBORHOODS.CODE,
            NEIGHBORHOODS.SIDO,
            NEIGHBORHOODS.SIGUNGU,
            NEIGHBORHOODS.EUPMYEONDONG
            )
            .from(NEIGHBORHOODS)
            .where(
                DSL.field(
                    """
                       ST_Contains(
                           boundary,
                           ST_SetSRID(ST_MakePoint({0}, {1}), 4326)
                       )
                    """,
                    Boolean::class.java,
                    longitude,
                    latitude
                )
            )
            .limit(1)
            .fetchOneInto(Neighborhood::class.java)
    }

    fun findNearbyNeighborhoods(latitude: Double, longitude: Double): List<Neighborhood> {
        return dslContext.select(
            NEIGHBORHOODS.ID,
            NEIGHBORHOODS.CODE,
            NEIGHBORHOODS.SIDO,
            NEIGHBORHOODS.SIGUNGU,
            NEIGHBORHOODS.EUPMYEONDONG
            )
            .from(NEIGHBORHOODS)
            .where(
                DSL.condition(
                    """
                        ST_DWithin(
                            centroid::geography,
                            ST_SetSRID(ST_MakePoint({0}, {1}), 4326)::geography,
                            2500
                        )
                    """,
                    longitude,
                    latitude
                )
            )
            .orderBy(
                DSL.field(
                    "centroid <-> ST_SetSRID(ST_MakePoint({0}, {1}), 4326)",
                    longitude,
                    latitude
                )
            )
            .limit(15)
            .fetchInto(Neighborhood::class.java)
    }
}