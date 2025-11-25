package io.github.daegwonkim.backend.enumerate.page;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SortBy {
    CREATED_AT("createdAt")
    ;

    private final String fieldName;

    public static SortBy fromString(String value) {
        if (value == null || value.isBlank()) {
            return CREATED_AT;
        }

        for (SortBy sortBy : values()) {
            if (sortBy.fieldName.equalsIgnoreCase(value)) {
                return sortBy;
            }
        }

        return CREATED_AT;
    }
}
