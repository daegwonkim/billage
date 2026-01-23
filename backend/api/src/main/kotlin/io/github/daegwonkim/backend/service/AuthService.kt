package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.coolsms.CoolsmsService
import io.github.daegwonkim.backend.dto.auth.CheckRegistrationRequest
import io.github.daegwonkim.backend.dto.auth.CheckRegistrationResponse
import io.github.daegwonkim.backend.dto.auth.ReissueTokenResponse
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignInResult
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeResponse
import io.github.daegwonkim.backend.dto.auth.SendVerificationCodeRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.exception.errorcode.AuthErrorCode
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.exception.infra.ExternalApiException
import io.github.daegwonkim.backend.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.redis.RefreshTokenRedisRepository
import io.github.daegwonkim.backend.redis.VerificationCodeRedisRepository
import io.github.daegwonkim.backend.redis.VerifiedTokenRedisRepository
import io.github.daegwonkim.backend.repository.jpa.UserRepository
import io.github.daegwonkim.backend.util.NicknameGenerator
import io.github.daegwonkim.backend.jwt.vo.GeneratedTokens
import io.github.daegwonkim.backend.jwt.vo.RefreshTokenClaims
import io.github.daegwonkim.backend.repository.jooq.UserJooqRepository
import io.github.daegwonkim.backend.vo.Neighborhood
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.util.UUID

@Service
class AuthService(
    private val neighborhoodService: NeighborhoodService,

    private val refreshTokenRedisRepository: RefreshTokenRedisRepository,
    private val verifiedTokenRedisRepository: VerifiedTokenRedisRepository,
    private val verificationCodeRedisRepository: VerificationCodeRedisRepository,

    private val userRepository: UserRepository,
    private val userJooqRepository: UserJooqRepository,

    private val coolsmsService: CoolsmsService,
    private val jwtTokenProvider: JwtTokenProvider,
    private val nicknameGenerator: NicknameGenerator,
) {

    companion object {
        private const val VERIFICATION_CODE_LENGTH = 6
    }

    fun sendVerificationCode(request: SendVerificationCodeRequest) {
        val phoneNo = request.phoneNo

        val generatedVerificationCode = generateVerificationCodeAndSave(phoneNo)
//        buildVerificationCodeMessageAndSendSms(phoneNo, generatedVerificationCode)
    }

    fun confirmVerificationCode(request: ConfirmVerificationCodeRequest): ConfirmVerificationCodeResponse {
        val phoneNo = request.phoneNo
        val verificationCode = request.verificationCode

//        confirmVerificationCode(phoneNo, verificationCode)
        val verifiedToken = generateVerifiedTokenAndSave(phoneNo)
        verificationCodeRedisRepository.delete(phoneNo)

        return ConfirmVerificationCodeResponse(verifiedToken)
    }

    fun checkRegistration(request: CheckRegistrationRequest): CheckRegistrationResponse {
        val registered = userRepository.existsByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
        return CheckRegistrationResponse(registered)
    }

    @Transactional
    fun signUp(request: SignUpRequest) {
        val phoneNo = request.phoneNo
        val verifiedToken = request.verifiedToken
        val latitude = request.neighborhood.latitude
        val longitude = request.neighborhood.longitude
        val code = request.neighborhood.code

        validateVerifiedToken(phoneNo, verifiedToken)

        val neighborhood = Neighborhood(latitude, longitude, code)
        neighborhoodService.validateNeighborhood(neighborhood)

        val userId = saveUser(phoneNo)
        neighborhoodService.saveNeighborhood(userId, neighborhood)
        userJooqRepository.updateNeighborhoodVerifiedAtById(userId)
    }

    @Transactional
    fun signIn(request: SignInRequest): SignInResult {
        val phoneNo = request.phoneNo

        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo)
            ?: throw AuthenticationException(logMessage = "존재하지 않는 사용자에 대한 인증 요청 발생: requestedBy=$phoneNo")

        validateVerifiedToken(phoneNo, request.verifiedToken)

        val generatedTokens = generateTokensAndSaveRefreshToken(user.id, UUID.randomUUID().toString(), 0)
        verifiedTokenRedisRepository.delete(phoneNo)

        userJooqRepository.updateLastActiveAtById(user.id)

        return SignInResult(user.id, generatedTokens.accessToken, generatedTokens.refreshToken)
    }

    fun reissueToken(refreshToken: String): ReissueTokenResponse {
        val claims = validateRefreshToken(refreshToken)
        val newVersion = claims.version + 1
        val generatedTokens = generateTokensAndSaveRefreshToken(claims.userId, claims.familyId, newVersion)

        return ReissueTokenResponse(generatedTokens.accessToken, generatedTokens.refreshToken)
    }

    fun signOut(accessToken: String) {
        val claims = jwtTokenProvider.getRefreshTokenClaims(accessToken) ?: return
        refreshTokenRedisRepository.delete(claims.familyId)
    }

    // Private helper methods

    fun generateVerificationCodeAndSave(phoneNo: String): String {
        val verificationCode = generateVerificationCode()
        verificationCodeRedisRepository.save(phoneNo, verificationCode)
        return verificationCode
    }

    fun buildVerificationCodeMessageAndSendSms(phoneNo: String, verificationCode: String) {
        val message = buildVerificationCodeMessage(verificationCode)
        requestSendSms(phoneNo, message)
    }

    private fun requestSendSms(phoneNo: String, message: String) {
        try {
            coolsmsService.sendSms(phoneNo, message)
        } catch (e: ExternalApiException) {
            verificationCodeRedisRepository.delete(phoneNo)
            throw e
        }
    }

    private fun generateVerifiedTokenAndSave(phoneNo: String): UUID {
        val verifiedToken = UUID.randomUUID()
        verifiedTokenRedisRepository.save(phoneNo, verifiedToken)
        return verifiedToken
    }

    private fun confirmVerificationCode(phoneNo: String, receivedVerificationCode: String) {
        val expectedVerificationCode = verificationCodeRedisRepository.find(phoneNo)

        when {
            expectedVerificationCode == null ->
                throw AuthenticationException(AuthErrorCode.VERIFICATION_CODE_EXPIRED, "인증코드 만료: requestedBy=$phoneNo, receivedValue=$receivedVerificationCode")
            expectedVerificationCode != receivedVerificationCode ->
                throw AuthenticationException(AuthErrorCode.INVALID_VERIFICATION_CODE, "인증코드 불일치: requestedBy=$phoneNo, expectedValue=$expectedVerificationCode, receivedValue=$receivedVerificationCode")
        }
    }

    private fun validateVerifiedToken(phoneNo: String, receivedVerifiedToken: String) {
        val expectedVerifiedToken = verifiedTokenRedisRepository.find(phoneNo)

        when {
            expectedVerifiedToken == null ->
                throw AuthenticationException(logMessage = "인증토큰 만료: requestedBy=$phoneNo, receivedValue=$receivedVerifiedToken")
            expectedVerifiedToken != receivedVerifiedToken ->
                throw AuthenticationException(logMessage = "인증토큰 불일치: requestedBy=$phoneNo, expectedValue=$expectedVerifiedToken, receivedValue=$receivedVerifiedToken")
        }
    }

    private fun saveUser(phoneNo: String): Long {
        val publicId = UUID.randomUUID().toString().uppercase().substring(0, 8)
        val user = userRepository.save(User(publicId = publicId, phoneNo = phoneNo, nickname = nicknameGenerator.generate()))
        return user.id
    }

    private fun generateTokensAndSaveRefreshToken(userId: Long, familyId: String, version: Int): GeneratedTokens {
        val generatedTokens = jwtTokenProvider.generateToken(userId, familyId, version)
        refreshTokenRedisRepository.save(familyId, version)

        return generatedTokens
    }

    private fun validateRefreshToken(refreshToken: String): RefreshTokenClaims {
        val claims = jwtTokenProvider.getRefreshTokenClaims(refreshToken)
            ?: throw AuthenticationException(logMessage = "유효하지 않은 Refresh Token")

        val storedVersion = refreshTokenRedisRepository.find(claims.familyId)

        when {
            storedVersion == null -> throw AuthenticationException(logMessage = "세션 만료")
            storedVersion != claims.version -> {
                refreshTokenRedisRepository.delete(claims.familyId)
                throw AuthenticationException(logMessage = "토큰 재사용 감지: claims=$claims")
            }
        }

        return claims
    }

    private fun buildVerificationCodeMessage(verificationCode: String): String =
        "[빌리지] 인증번호는 [$verificationCode] 입니다.\n*절대 타인에게 노출하지 마세요.*"

    private fun generateVerificationCode(): String =
        SecureRandom().nextInt(10.pow(VERIFICATION_CODE_LENGTH))
            .let { "%0${VERIFICATION_CODE_LENGTH}d".format(it) }

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }
}