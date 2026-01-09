package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.jooq.Tables.NEIGHBORHOODS
import io.github.daegwonkim.backend.repository.projection.NeighborhoodProjection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class NeighborhoodJooqRepository(
    private val dslContext: DSLContext
) {
    fun findByCoordinate(latitude: Double, longitude: Double): NeighborhoodProjection? {
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
            .fetchOneInto(NeighborhoodProjection::class.java)
    }

    fun findNearbyNeighborhoods(latitude: Double, longitude: Double): List<NeighborhoodProjection> {
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
            .fetchInto(NeighborhoodProjection::class.java)
    }
}