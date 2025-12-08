package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.common.exception.data.ErrorCode
import io.github.daegwonkim.backend.common.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.repository.RefreshTokenRedisRepository
import io.github.daegwonkim.backend.dto.TokenReissueResponse
import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.TokenReissueRequest
import io.github.daegwonkim.backend.dto.SignInRequest
import io.github.daegwonkim.backend.dto.SignInResponse
import io.github.daegwonkim.backend.dto.SignUpRequest
import io.github.daegwonkim.backend.dto.SignUpResponse
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenDeleteEvent
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenSaveEvent
import io.github.daegwonkim.backend.common.event.dto.VerifiedTokenDeleteEvent
import io.github.daegwonkim.backend.common.exception.ExternalServiceException
import io.github.daegwonkim.backend.common.exception.InvalidValueException
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.entity.UserNeighborhood
import io.github.daegwonkim.backend.logger
import io.github.daegwonkim.backend.repository.NeighborhoodRepository
import io.github.daegwonkim.backend.repository.UserNeighborhoodRepository
import io.github.daegwonkim.backend.repository.VerifiedTokenRedisRepository
import io.github.daegwonkim.backend.repository.UserRepository
import io.github.daegwonkim.backend.repository.VerificationCodeRedisRepository
import io.github.daegwonkim.backend.util.KakaoMapService
import io.github.daegwonkim.backend.util.NicknameGenerator
import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.response.SingleMessageSentResponse
import net.nurigo.sdk.message.service.DefaultMessageService
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.GeometryFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.util.UUID

@Service
class AuthService(
    private val messageService: DefaultMessageService,
    private val kakaoMapService: KakaoMapService,

    private val refreshTokenRedisRepository: RefreshTokenRedisRepository,
    private val verifiedTokenRedisRepository: VerifiedTokenRedisRepository,
    private val verificationCodeRedisRepository: VerificationCodeRedisRepository,

    private val userRepository: UserRepository,
    private val neighborhoodRepository: NeighborhoodRepository,
    private val userNeighborhoodRepository: UserNeighborhoodRepository,

    private val jwtTokenProvider: JwtTokenProvider,
    private val eventPublisher: ApplicationEventPublisher,
    private val nicknameGenerator: NicknameGenerator,
    private val geometryFactory: GeometryFactory,

    @Value($$"${coolsms.from}")
    private val smsFrom: String
) {

    companion object {
        private const val COOLSMS_SUCCESS_CODE = "2000"
        private const val VERIFICATION_CODE_LENGTH = 6
    }

    fun sendVerificationCode(request: VerificationCodeSendRequest) {
        val verificationCode = generateVerificationCode()

        verificationCodeRedisRepository.save(phoneNo = request.phoneNo, verificationCode = verificationCode)

        val smsResponse = sendSms(phoneNo = request.phoneNo, verificationCode = verificationCode)

        if (smsResponse?.statusCode != COOLSMS_SUCCESS_CODE) {
            logger.error {
                "SMS 발송 실패: statusCode=${smsResponse?.statusCode}, message=${smsResponse?.statusMessage}, phoneNo=${request.phoneNo}"
            }
            verificationCodeRedisRepository.delete(phoneNo = request.phoneNo)
            throw ExternalServiceException(errorCode = ErrorCode.SMS_SEND_FAILED)
        }
    }

    fun confirmVerificationCode(request: VerificationCodeConfirmRequest): VerificationCodeConfirmResponse {
        validateVerificationCode(phoneNo = request.phoneNo, verificationCode = request.verificationCode)

        val verifiedToken = UUID.randomUUID().toString()

        verifiedTokenRedisRepository.save(phoneNo = request.phoneNo, verifiedToken = verifiedToken)
        verificationCodeRedisRepository.delete(phoneNo = request.phoneNo)

        return VerificationCodeConfirmResponse(verifiedToken = verifiedToken)
    }

    @Transactional(readOnly = true)
    fun confirmPhoneNo(request: PhoneNoConfirmRequest) {
        userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo = request.phoneNo)
            ?: throw NotFoundException(errorCode = ErrorCode.USER_NOT_FOUND)
    }

    @Transactional
    fun signUp(request: SignUpRequest): SignUpResponse {
        validateVerifiedToken(phoneNo = request.phoneNo, verifiedToken = request.verifiedToken)
        validateNeighborhood(
            latitude = request.neighborhood.latitude,
            longitude = request.neighborhood.longitude,
            inputCode = request.neighborhood.code
        )

        val user = userRepository.save(
            User(
                phoneNo = request.phoneNo,
                nickname = nicknameGenerator.generate()
            )
        )
        val userId = requireNotNull(user.id) { "User ID should not be null" }

        val neighborhood = neighborhoodRepository.findByCode(request.neighborhood.code)
            ?: throw NotFoundException(ErrorCode.NEIGHBORHOOD_NOT_FOUND)
        val neighborhoodId = requireNotNull(neighborhood.id) { "Neighborhood ID should not be null" }

        userNeighborhoodRepository.save(
            UserNeighborhood(
                userId = userId,
                neighborhoodId = neighborhoodId,
                location = geometryFactory.createPoint(
                    Coordinate(request.neighborhood.longitude, request.neighborhood.latitude)
                )
            )
        )

        val accessToken = jwtTokenProvider.generateAccessToken(userId = userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId = userId)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId = userId, refreshToken = refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(phoneNo = request.phoneNo))

        return SignUpResponse(accessToken = accessToken, refreshToken = refreshToken)
    }

    @Transactional(readOnly = true)
    fun signIn(request: SignInRequest): SignInResponse {
        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo = request.phoneNo)
            ?: throw NotFoundException(errorCode = ErrorCode.USER_NOT_FOUND)

        validateVerifiedToken(phoneNo = request.phoneNo, verifiedToken = request.verifiedToken)

        val userId = requireNotNull(user.id) { "User ID should not be null" }

        val accessToken = jwtTokenProvider.generateAccessToken(userId = userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId = userId)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId = userId, refreshToken = refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(phoneNo = request.phoneNo))

        return SignInResponse(accessToken = accessToken, refreshToken = refreshToken)
    }

    @Transactional(readOnly = true)
    fun reissueToken(request: TokenReissueRequest): TokenReissueResponse {
        if (!jwtTokenProvider.validateToken(token = request.refreshToken)) {
            throw InvalidValueException(errorCode = ErrorCode.INVALID_REFRESH_TOKEN)
        }

        val userId = jwtTokenProvider.getUserIdFromToken(token = request.refreshToken)

        userRepository.findByIdOrNull(id = userId)
            ?: throw NotFoundException(errorCode = ErrorCode.USER_NOT_FOUND)

        validateRefreshToken(userId = userId, refreshToken = request.refreshToken)

        val newAccessToken = jwtTokenProvider.generateAccessToken(userId = userId)
        val newRefreshToken = jwtTokenProvider.generateRefreshToken(userId = userId)

        eventPublisher.publishEvent(RefreshTokenDeleteEvent(userId = userId))
        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId = userId, refreshToken = newRefreshToken))

        return TokenReissueResponse(accessToken = newAccessToken, refreshToken = newRefreshToken)
    }

    // Private helper methods

    private fun validateNeighborhood(latitude: Double, longitude: Double, inputCode: String) {
        val address = kakaoMapService.coordToAddress(
            latitude = latitude,
            longitude = longitude
        )
        val code = address?.documents?.find { it.regionType == "B" }?.code

        if (inputCode != code) {
            logger.warn { "사용자 동네 정보 불일치: inputCode=${inputCode}, code=$code" }
            throw InvalidValueException(ErrorCode.NEIGHBORHOOD_MISMATCH)
        }
    }

    private fun validateVerificationCode(phoneNo: String, verificationCode: String) {
        val savedCode = verificationCodeRedisRepository.find(phoneNo = phoneNo)

        when {
            savedCode == null -> {
                logger.warn { "존재하지 않는 인증 코드 조회 시도: phoneNo=$phoneNo" }
                throw NotFoundException(errorCode = ErrorCode.VERIFICATION_CODE_NOT_FOUND)
            }
            savedCode != verificationCode -> {
                logger.warn { "인증 코드 불일치: phoneNo=$phoneNo" }
                throw InvalidValueException(errorCode = ErrorCode.VERIFICATION_CODE_MISMATCH)
            }
        }
    }

    private fun validateVerifiedToken(phoneNo: String, verifiedToken: String) {
        val savedToken = verifiedTokenRedisRepository.find(phoneNo = phoneNo)

        when {
            savedToken == null -> {
                logger.warn { "존재하지 않는 인증 토큰 조회 시도: phoneNo=$phoneNo" }
                throw NotFoundException(errorCode = ErrorCode.VERIFIED_TOKEN_NOT_FOUND)
            }
            savedToken != verifiedToken -> {
                logger.warn { "인증 토큰 불일치: phoneNo=$phoneNo" }
                throw InvalidValueException(errorCode = ErrorCode.VERIFIED_TOKEN_MISMATCH)
            }
        }
    }

    private fun validateRefreshToken(userId: UUID, refreshToken: String) {
        val savedRefreshToken = refreshTokenRedisRepository.find(userId = userId)

        when {
            savedRefreshToken == null -> {
                logger.warn { "존재하지 않는 RefreshToken 조회 시도: userId=$userId" }
                throw NotFoundException(errorCode = ErrorCode.REFRESH_TOKEN_NOT_FOUND)
            }
            savedRefreshToken != refreshToken -> {
                logger.warn { "RefreshToken 불일치: userId=$userId" }
                throw InvalidValueException(errorCode = ErrorCode.REFRESH_TOKEN_MISMATCH)
            }
        }
    }

    private fun sendSms(phoneNo: String, verificationCode: String): SingleMessageSentResponse? {
        val message = Message().apply {
            from = smsFrom
            to = phoneNo
            text = buildVerificationCodeMessage(verificationCode = verificationCode)
        }

        return messageService.sendOne(parameter = SingleMessageSendingRequest(message))
    }

    private fun buildVerificationCodeMessage(verificationCode: String): String =
        "[빌리지] 인증번호는 [$verificationCode] 입니다.\n*절대 타인에게 노출하지 마세요.*"

    private fun generateVerificationCode(): String =
        SecureRandom().nextInt(10.pow(VERIFICATION_CODE_LENGTH))
            .let { "%0${VERIFICATION_CODE_LENGTH}d".format(it) }

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }
}