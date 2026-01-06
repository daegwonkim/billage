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

@Entity
@Table(name = "user_neighborhoods")
class UserNeighborhood(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(name = "neighborhood_id", nullable = false)
    val neighborhoodId: Long,

    @Column(columnDefinition = "geometry(Point, 4326)")
    val location: Point
) {
    companion object {
        fun create(userId: Long, neighborhoodId: Long, latitude: Double, longitude: Double): UserNeighborhood {
            return UserNeighborhood(
                userId = userId,
                neighborhoodId = neighborhoodId,
                location = GeometryFactory(PrecisionModel(), 4326)
                    .createPoint(Coordinate(longitude, latitude))
            )
        }
    }
}