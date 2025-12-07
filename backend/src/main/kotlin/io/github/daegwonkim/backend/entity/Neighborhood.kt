package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Point
import java.util.UUID

@Entity
@Table(name = "neighborhoods")
class Neighborhood(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    val id: UUID? = null,

    @Column(nullable = false, unique = true)
    val code: String,

    @Column(nullable = false)
    val sido: String,

    @Column(nullable = false)
    val sigungu: String,

    @Column(nullable = false)
    val eupmyeondong: String,

    @Column(columnDefinition = "geometry(Point, 4326)")
    val location: Point
)