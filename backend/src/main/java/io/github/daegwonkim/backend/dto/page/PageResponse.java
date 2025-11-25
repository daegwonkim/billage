package io.github.daegwonkim.backend.dto.page;

import lombok.Builder;

import java.util.List;

@Builder
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        int totalElements,
        int totalPages
) {
}
