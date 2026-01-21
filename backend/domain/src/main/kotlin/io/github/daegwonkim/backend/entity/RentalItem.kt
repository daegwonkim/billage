package io.github.daegwonkim.backend.entity

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "rental_items")
class RentalItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(name = "seller_id", nullable = false)
    var sellerId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var category: RentalItemCategory,

    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var description: String,

    @Column(name = "price_per_day")
    var pricePerDay: Int?,

    @Column(name = "price_per_week")
    var pricePerWeek: Int?,

    @Column(name = "view_count", nullable = false)
    var viewCount: Int = 0,

    @Column(name = "is_deleted", nullable = false)
    var isDeleted: Boolean = false
) : BaseEntity() {

    fun modify(
        category: RentalItemCategory,
        title: String,
        description: String,
        pricePerDay: Int?,
        pricePerWeek: Int?
    ) {
        this.category = category
        this.title = title
        this.description = description
        this.pricePerDay = pricePerDay
        this.pricePerWeek = pricePerWeek
    }
}