package io.github.daegwonkim.backend.dto.rental_item.response;

import java.util.List;

public record RentalItemCategoryResponse(
    List<RentalItemCategory> categories
) {
    public record RentalItemCategory(
            int order,
            String icon,
            String label
    ) {}
}
