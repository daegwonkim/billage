package io.github.daegwonkim.backend.dto.neighborhood

import io.github.daegwonkim.backend.repository.projection.NeighborhoodProjection

data class LocateNeighborhoodResponse(
    val code: String,
    val sido: String,
    val sigungu: String,
    val eupmyeondong: String
) {
    companion object {
        fun from(neighborhood: NeighborhoodProjection): LocateNeighborhoodResponse =
            LocateNeighborhoodResponse(neighborhood.code, neighborhood.sido, neighborhood.sigungu,
                neighborhood.eupmyeondong)
    }
}
