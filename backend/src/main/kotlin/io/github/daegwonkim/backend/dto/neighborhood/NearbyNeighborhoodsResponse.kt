package io.github.daegwonkim.backend.dto.neighborhood

data class NearbyNeighborhoodsResponse(
    val neighborhoods: List<Neighborhood>
) {
    data class Neighborhood(
        val name: String,
        val code: String
    )
}
