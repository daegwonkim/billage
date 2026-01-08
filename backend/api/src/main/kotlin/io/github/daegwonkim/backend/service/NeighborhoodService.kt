package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.neighborhood.LocateNeighborhoodResponse
import io.github.daegwonkim.backend.dto.neighborhood.NearbyNeighborhoodsResponse
import io.github.daegwonkim.backend.entity.UserNeighborhood
import io.github.daegwonkim.backend.entity.command.CreateUserNeighborhoodCommand
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.repository.NeighborhoodJooqRepository
import io.github.daegwonkim.backend.repository.NeighborhoodRepository
import io.github.daegwonkim.backend.repository.UserNeighborhoodRepository
import io.github.daegwonkim.backend.repository.projection.NeighborhoodProjection
import io.github.daegwonkim.backend.vo.Neighborhood
import org.springframework.stereotype.Service

@Service
class NeighborhoodService(
    private val neighborhoodJooqRepository: NeighborhoodJooqRepository,
    private val neighborhoodRepository: NeighborhoodRepository,
    private val userNeighborhoodRepository: UserNeighborhoodRepository
) {
    fun locate(latitude: Double, longitude: Double): LocateNeighborhoodResponse {
        val neighborhood = neighborhoodJooqRepository.findByCoordinate(latitude, longitude)
            ?: throw ResourceNotFoundException("Neighborhood", "lat=$latitude, lng=$longitude")

        return LocateNeighborhoodResponse(neighborhood.code)
    }

    fun nearby(latitude: Double, longitude: Double): NearbyNeighborhoodsResponse {
        val nearbyNeighborhoods = neighborhoodJooqRepository.findNearbyNeighborhoods(latitude, longitude)
            .map(::toNearbyNeighborhoodResponse)

        return NearbyNeighborhoodsResponse(nearbyNeighborhoods)
    }

    fun validateNeighborhood(requestedNeighborhood: Neighborhood) {
        val neighborhood = neighborhoodJooqRepository.findByCoordinate(
            requestedNeighborhood.latitude,
            requestedNeighborhood.longitude
        ) ?: throw ResourceNotFoundException(
            "Neighborhood",
            "lat=${requestedNeighborhood.latitude}, lng=${requestedNeighborhood.longitude}"
        )

        if (neighborhood.code != requestedNeighborhood.code) {
            throw AuthenticationException(AuthenticationException.Reason.INVALID_NEIGHBORHOOD)
        }
    }

    fun saveNeighborhood(userId: Long, requestedNeighborhood: Neighborhood) {
        val neighborhood = neighborhoodRepository.findByCode(requestedNeighborhood.code)
            ?: throw ResourceNotFoundException("Neighborhood", "code=${requestedNeighborhood.code}")

        val command = CreateUserNeighborhoodCommand(
            userId = userId,
            neighborhoodId = neighborhood.id,
            latitude = requestedNeighborhood.latitude,
            longitude = requestedNeighborhood.longitude
        )
        userNeighborhoodRepository.save(UserNeighborhood.create(command))
    }

    private fun toNearbyNeighborhoodResponse(
        neighborhood: NeighborhoodProjection
    ): NearbyNeighborhoodsResponse.Neighborhood =
        NearbyNeighborhoodsResponse.Neighborhood(
            "${neighborhood.sido} ${neighborhood.sigungu} ${neighborhood.eupmyeondong}",
            neighborhood.code
        )
}