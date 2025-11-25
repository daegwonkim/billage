package io.github.daegwonkim.backend.enumerate.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RentalItemCategory {
    POPULAR("popular"),
    HOUSEHOLD("household"),
    TRAVEL("travel"),
    SPORTS("sports"),
    ELECTRONICS("electronics"),
    FASHION("fashion"),
    CHILDCARE("childcare")
    ;

    private final String fieldName;

    public static RentalItemCategory fromString(String value) {
        if (value == null || value.isBlank()) {
            return POPULAR;
        }

        for (RentalItemCategory category : values()) {
            if (category.fieldName.equalsIgnoreCase(value)) {
                return category;
            }
        }

        return POPULAR;
    }
}
