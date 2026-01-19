package io.github.daegwonkim.backend.dto.rental_item

import io.github.daegwonkim.backend.repository.projection.RentalItemProjection
import java.time.Instant

data class GetRentalItemResponse(
    val id: Long,
    val seller: Seller,
    val category: String,
    val title: String,
    val description: String,
    val imageUrls: List<String>,
    val pricePerDay: Int,
    val pricePerWeek: Int,
    val rentalCount: Int,
    val likeCount: Int,
    val viewCount: Int,
    val liked: Boolean,
    val createdAt: Instant
) {
    data class Seller(
        val id: Long,
        val nickname: String,
        val address: String,
        val profileImageUrl: String?
    )

    companion object {
        fun from(
            item: RentalItemProjection,
            imageUrls: List<String>,
            sellerProfileImageUrl: String?
        ): GetRentalItemResponse = GetRentalItemResponse(
            id = item.id,
            seller = Seller(
                id = item.sellerId,
                nickname = item.sellerNickname,
                address = item.address,
                profileImageUrl = sellerProfileImageUrl
            ),
            category = item.category.label,
            title = item.title,
            description = item.description,
            imageUrls = imageUrls,
            pricePerDay = item.pricePerDay,
            pricePerWeek = item.pricePerWeek,
            rentalCount = item.rentalCount,
            likeCount = item.likeCount,
            viewCount = item.viewCount,
            liked = item.liked,
            createdAt = item.createdAt
        )
    }
}
