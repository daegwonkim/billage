package io.github.daegwonkim.backend.repository.projection

import io.github.daegwonkim.backend.enumerate.RentalItemCategory

data class ChatRoomProjection(
    val id: Long,
    val rentalItemId: Long,
    val rentalItemCategory: RentalItemCategory,
    val rentalItemTitle: String,
    val rentalItemPricePerDay: Int?,
    val rentalItemPricePerWeek: Int?,
    val rentalItemThumbnailImageKey: String,
    val sellerId: Long,
    val sellerNickname: String,
    val sellerProfileImageKey: String?,
    val sellerAddress: String
)
