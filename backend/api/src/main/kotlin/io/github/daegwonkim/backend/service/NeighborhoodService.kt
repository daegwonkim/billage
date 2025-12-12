package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.neighborhood.LocateNeighborhoodResponse
import io.github.daegwonkim.backend.dto.neighborhood.NearbyNeighborhoodsResponse
import io.github.daegwonkim.backend.entity.UserNeighborhood
import io.github.daegwonkim.backend.exception.InvalidValueException
import io.github.daegwonkim.backend.exception.NotFoundException
import io.github.daegwonkim.backend.exception.data.ErrorCode
import io.github.daegwonkim.backend.logger
import io.github.daegwonkim.backend.repository.NeighborhoodJooqRepository
import io.github.daegwonkim.backend.repository.NeighborhoodRepository
import io.github.daegwonkim.backend.repository.UserNeighborhoodRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NeighborhoodService(
    private val neighborhoodJooqRepository: NeighborhoodJooqRepository,
    private val neighborhoodRepository: NeighborhoodRepository,
    private val userNeighborhoodRepository: UserNeighborhoodRepository
) {
    fun locate(latitude: Double, longitude: Double): LocateNeighborhoodResponse {
        val neighborhood = neighborhoodJooqRepository.findByCoordinate(
            latitude = latitude,
            longitude = longitude
        ) ?: throw NotFoundException(ErrorCode.NEIGHBORHOOD_NOT_FOUND)

        return LocateNeighborhoodResponse(code = neighborhood.code)
    }

    fun nearby(latitude: Double, longitude: Double): NearbyNeighborhoodsResponse {
        val neighborhoods = neighborhoodJooqRepository.findNearbyNeighborhoods(
            latitude = latitude,
            longitude = longitude
        ).map { neighborhood ->
            NearbyNeighborhoodsResponse.Neighborhood(
                name = "${neighborhood.sido} ${neighborhood.sigungu} ${neighborhood.eupmyeondong}",
                code = neighborhood.code
            )
        }

        return NearbyNeighborhoodsResponse(neighborhoods)
    }

    fun validateNeighborhood(latitude: Double, longitude: Double, inputCode: String) {
        val neighborhood = neighborhoodJooqRepository.findByCoordinate(latitude, longitude)

        when {
            neighborhood == null -> {
                logger.warn { "존재하지 않는 위치값: latitude: $latitude, longitude: $longitude" }
                throw NotFoundException(errorCode = ErrorCode.NEIGHBORHOOD_NOT_FOUND)
            }
            inputCode != neighborhood.code -> {
                logger.warn { "사용자 동네 정보 불일치: inputCode=${inputCode}, code=${neighborhood.code}" }
                throw InvalidValueException(errorCode = ErrorCode.NEIGHBORHOOD_MISMATCH)
            }
        }
    }

    fun saveNeighborhood(userId: UUID, latitude: Double, longitude: Double, code: String) {
        val neighborhood = neighborhoodRepository.findByCode(code = code)
            ?: throw NotFoundException(errorCode = ErrorCode.NEIGHBORHOOD_NOT_FOUND)
        val neighborhoodId = requireNotNull(value = neighborhood.id) { "Neighborhood ID should not be null" }

        userNeighborhoodRepository.save(
            UserNeighborhood.create(
                userId = userId,
                neighborhoodId = neighborhoodId,
                latitude = latitude,
                longitude = longitude
            )
        )
    }
}