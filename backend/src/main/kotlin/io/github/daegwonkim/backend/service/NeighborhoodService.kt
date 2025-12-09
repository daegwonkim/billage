package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.common.exception.InvalidValueException
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.common.exception.data.ErrorCode
import io.github.daegwonkim.backend.entity.UserNeighborhood
import io.github.daegwonkim.backend.logger
import io.github.daegwonkim.backend.repository.NeighborhoodRepository
import io.github.daegwonkim.backend.repository.UserNeighborhoodRepository
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.GeometryFactory
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NeighborhoodService(
    private val neighborhoodRepository: NeighborhoodRepository,
    private val userNeighborhoodRepository: UserNeighborhoodRepository,
    private val geometryFactory: GeometryFactory,
) {
    fun validateNeighborhood(latitude: Double, longitude: Double, inputCode: String) {
        val neighborhood = neighborhoodRepository.findByCoordinate(latitude, longitude)

        when {
            neighborhood == null -> {
                logger.warn { "존재하지 않는 위치값: latitude: $latitude, longitude: $longitude" }
                throw InvalidValueException(errorCode = ErrorCode.NEIGHBORHOOD_NOT_FOUND)
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
            UserNeighborhood(
                userId = userId,
                neighborhoodId = neighborhoodId,
                location = geometryFactory.createPoint(
                    Coordinate(longitude, latitude)
                )
            )
        )
    }
}