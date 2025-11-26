package io.github.daegwonkim.backend.dto.rental_item.response;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

public record SimilarRentalItemsResponse(
        List<RentalItem> rentalItems
) {
    @Builder
    public record RentalItem(
        UUID id,
        String name,
        String thumbnailImageUrl,
        int pricePerDay,
        int pricePerWeek
    ) {}
}
