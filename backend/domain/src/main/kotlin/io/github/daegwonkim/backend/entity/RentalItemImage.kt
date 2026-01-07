package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "rental_item_images")
class RentalItemImage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "rental_item_id", nullable = false)
    var rentalItemId: Long,

    @Column(nullable = false)
    var key: String,

    @Column(nullable = false)
    var sequence: Int
)