package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "rental_item_images")
class RentalItemImage(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    val id: UUID? = null,

    @Column(name = "rental_item_id", nullable = false)
    var rentalItemId: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var sequence: Int
)