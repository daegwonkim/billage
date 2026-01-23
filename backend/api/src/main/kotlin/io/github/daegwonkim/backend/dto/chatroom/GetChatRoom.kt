package io.github.daegwonkim.backend.dto.chatroom

import io.github.daegwonkim.backend.enumerate.RentalItemCategory

data class GetChatRoomResponse(
    val id: Long,
    val rentalItem: RentalItem,
    val participants: List<Participant>
) {
    data class RentalItem(
        val id: Long,
        val seller: Seller,
        val category: RentalItemCategory,
        val title: String,
        val pricePerDay: Int?,
        val pricePerWeek: Int?,
        val thumbnailImageUrl: String
    ) {
        data class Seller(
            val id: Long,
            val nickname: String,
            val profileImageUrl: String?,
            val address: String
        )
    }

    data class Participant(
        val id: Long,
        val nickname: String,
        val profileImageUrl: String?
    )
}