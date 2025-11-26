package io.github.daegwonkim.backend.dto.rental_item.response;

import java.util.List;

public record RentalItemCategoriesResponse(
    List<RentalItemCategory> rentalItemCategories
) {
    public record RentalItemCategory(
            int order,
            String icon,
            String label
    ) {}
}
