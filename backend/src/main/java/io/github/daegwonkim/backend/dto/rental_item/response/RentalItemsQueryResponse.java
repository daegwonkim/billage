package io.github.daegwonkim.backend.dto.rental_item.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record RentalItemsQueryResponse(
        UUID id,
        String name,
        String thumbnailImageUrl,
        String address,
        int pricePerDay,
        int pricePerWeek,
        int rentals,
        int chats,
        int likes,
        LocalDateTime createdAt
) {
}
