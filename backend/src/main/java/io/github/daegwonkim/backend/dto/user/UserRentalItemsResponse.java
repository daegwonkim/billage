package io.github.daegwonkim.backend.dto.user;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

public record UserRentalItemsResponse(
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
