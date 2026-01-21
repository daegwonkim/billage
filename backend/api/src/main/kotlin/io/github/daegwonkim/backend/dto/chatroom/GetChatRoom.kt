package io.github.daegwonkim.backend.dto.chatroom

import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.repository.projection.ChatRoomProjection

data class GetChatRoomResponse(
    val chatRoomId: Long,
    val rentalItem: RentalItem,
    val seller: Seller
) {
    companion object {
        fun from(
            projection: ChatRoomProjection,
            rentalItemThumbnailImageUrl: String,
            sellerProfileImageUrl: String?
        ): GetChatRoomResponse {
            val rentalItem = RentalItem(
                projection.rentalItemId,
                projection.rentalItemCategory,
                projection.rentalItemTitle,
                projection.rentalItemPricePerDay,
                projection.rentalItemPricePerWeek,
                rentalItemThumbnailImageUrl
            )

            val seller = Seller(
                projection.sellerId,
                projection.sellerNickname,
                sellerProfileImageUrl,
                projection.sellerAddress
            )

            return GetChatRoomResponse(projection.chatRoomId, rentalItem, seller)
        }
    }

    data class RentalItem(
        val id: Long,
        val category: RentalItemCategory,
        val title: String,
        val pricePerDay: Int?,
        val pricePerWeek: Int?,
        val thumbnailImageUrl: String
    )

    data class Seller(
        val id: Long,
        val nickname: String,
        val profileImageUrl: String?,
        val address: String
    )
}