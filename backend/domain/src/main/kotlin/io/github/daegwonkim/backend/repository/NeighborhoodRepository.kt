package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.Neighborhood
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface NeighborhoodRepository : JpaRepository<Neighborhood, UUID> {
    fun findByCode(code: String): Neighborhood?

    @Query(
        value = """
            SELECT * FROM neighborhoods
            WHERE ST_Contains(
                boundary,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
            )
            LIMIT 1
        """,
        nativeQuery = true
    )
    fun findByCoordinate(
        @Param("latitude") latitude: Double,
        @Param("longitude") longitude: Double
    ): Neighborhood?

    @Query(
        value = """
            SELECT *
            FROM neighborhoods
            WHERE ST_DWithin(
                centroid::geography,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                2500
            )
            ORDER BY centroid <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
            LIMIT 15;
        """,
        nativeQuery = true
    )
    fun findNearbyNeighborhoods(
        @Param("latitude") latitude: Double,
        @Param("longitude") longitude: Double
    ): List<Neighborhood>
}