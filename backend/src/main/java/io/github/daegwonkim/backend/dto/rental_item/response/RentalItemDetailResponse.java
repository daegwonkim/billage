package io.github.daegwonkim.backend.dto.rental_item.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Builder
public record RentalItemDetailResponse(
        UUID id,
        Seller seller,
        String name,
        String description,
        String category,
        List<String> imageUrls,
        int pricePerDay,
        int pricePerWeek,
        boolean isLiked,
        int rentals,
        int chats,
        int likes,
        int views,
        LocalDateTime createdAt
) {
    @Builder
    public record Seller(
            UUID id,
            String name,
            String profileImageUrl,
            int trustLevel,
            String address
    ) {}
}
