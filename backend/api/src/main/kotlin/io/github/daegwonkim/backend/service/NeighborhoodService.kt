package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.neighborhood.LocateNeighborhoodResponse
import io.github.daegwonkim.backend.dto.neighborhood.NearbyNeighborhoodsResponse
import io.github.daegwonkim.backend.entity.UserNeighborhood
import io.github.daegwonkim.backend.exception.business.InvalidRequestException
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.repository.NeighborhoodJooqRepository
import io.github.daegwonkim.backend.repository.NeighborhoodRepository
import io.github.daegwonkim.backend.repository.UserNeighborhoodRepository
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
        val neighborhoods = neighborhoodJooqRepository.findNearbyNeighborhoods(latitude, longitude)
            .map { neighborhood ->
                NearbyNeighborhoodsResponse.Neighborhood(
                    "${neighborhood.sido} ${neighborhood.sigungu} ${neighborhood.eupmyeondong}",
                    neighborhood.code
                )
            }

        return NearbyNeighborhoodsResponse(neighborhoods)
    }

    fun validateNeighborhood(latitude: Double, longitude: Double, inputCode: String) {
        val neighborhood = neighborhoodJooqRepository.findByCoordinate(latitude, longitude)
            ?: throw ResourceNotFoundException("Neighborhood", "lat=$latitude, lng=$longitude")

        if (inputCode != neighborhood.code) {
            throw InvalidRequestException("동네 정보가 일치하지 않습니다")
        }
    }

    fun saveNeighborhood(userId: Long, latitude: Double, longitude: Double, code: String) {
        val neighborhood = neighborhoodRepository.findByCode(code)
            ?: throw ResourceNotFoundException("Neighborhood", "code=$code")

        val neighborhoodId = requireNotNull(neighborhood.id) { "Neighborhood ID should not be null" }

        userNeighborhoodRepository.save(UserNeighborhood.create(userId, neighborhoodId, latitude, longitude))
    }
}