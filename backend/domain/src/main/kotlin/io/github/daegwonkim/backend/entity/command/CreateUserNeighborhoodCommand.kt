package io.github.daegwonkim.backend.entity.command

data class CreateUserNeighborhoodCommand(
    val userId: Long,
    val neighborhoodId: Long,
    val latitude: Double,
    val longitude: Double
)
