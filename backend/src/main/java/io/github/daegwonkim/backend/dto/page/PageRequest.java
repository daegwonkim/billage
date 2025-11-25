package io.github.daegwonkim.backend.dto.page;

import io.github.daegwonkim.backend.enumerate.page.SortBy;
import io.github.daegwonkim.backend.enumerate.page.SortDirection;

public record PageRequest(
        int page,
        int size,
        SortBy sortBy,
        SortDirection sortDirection
) {
    public PageRequest {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0 || size > 10) {
            size = 10;
        }
        if (sortBy == null) {
            sortBy = SortBy.CREATED_AT;
        }
        if (sortDirection == null) {
            sortDirection = SortDirection.DESC;
        }
    }
}
