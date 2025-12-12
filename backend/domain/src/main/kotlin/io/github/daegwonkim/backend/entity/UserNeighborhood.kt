package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.Point
import org.locationtech.jts.geom.PrecisionModel
import java.util.UUID

@Entity
@Table(name = "user_neighborhoods")
class UserNeighborhood(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    val id: UUID? = null,

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    val userId: UUID,

    @Column(name = "neighborhood_id", columnDefinition = "UUID", nullable = false)
    val neighborhoodId: UUID,

    @Column(columnDefinition = "geometry(Point, 4326)")
    val location: Point
) {
    companion object {
        fun create(userId: UUID, neighborhoodId: UUID, latitude: Double, longitude: Double): UserNeighborhood {
            return UserNeighborhood(
                userId = userId,
                neighborhoodId = neighborhoodId,
                location = GeometryFactory(PrecisionModel(), 4326)
                    .createPoint(Coordinate(longitude, latitude))
            )
        }
    }
}