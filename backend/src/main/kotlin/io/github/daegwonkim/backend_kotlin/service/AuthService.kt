package io.github.daegwonkim.backend_kotlin.service

import io.github.daegwonkim.backend_kotlin.common.exception.ErrorCode
import io.github.daegwonkim.backend_kotlin.common.exception.ExternalServiceException
import io.github.daegwonkim.backend_kotlin.common.exception.NotFoundException
import io.github.daegwonkim.backend_kotlin.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend_kotlin.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend_kotlin.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend_kotlin.repository.UserRepository
import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.UUID
import java.util.concurrent.TimeUnit
import kotlin.also

@Service
class AuthService(
    private val messageService: DefaultMessageService,
    private val redisTemplate: StringRedisTemplate,
    private val userRepository: UserRepository,
    @Value($$"${coolsms.from}")
    private val smsFrom: String,
    @Value($$"${verification-code.expiration}")
    private val verificationCodeExpiration: Long,
    @Value($$"${verified-token.expiration}")
    private val verifiedTokenExpiration: Long
) {
    companion object {
        private const val VERIFICATION_CODE_KEY_PREFIX = "verificationCode:"
        private const val VERIFIED_TOKEN_KEY_PREFIX = "verifiedToken:"
        private const val COOLSMS_SUCCESS_CODE = "2000"
        private const val VERIFICATION_CODE_LENGTH = 6
    }

    fun sendVerificationCode(request: VerificationCodeSendRequest) {
        val verificationCode = generateVerificationCode()

        sendSms(request.phoneNo, verificationCode)
            .takeIf { it }
            ?.also { redisTemplate.saveVerificationCode(request.phoneNo, verificationCode) }
            ?: throw ExternalServiceException(ErrorCode.SMS_SEND_FAILED)
    }

    fun confirmVerificationCode(request: VerificationCodeConfirmRequest): String {
        val savedCode = redisTemplate.getVerificationCode(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.VERIFICATION_CODE_NOT_FOUND)

        savedCode.takeIf { it == request.verificationCode }
            ?: throw NotFoundException(ErrorCode.VERIFICATION_CODE_MISMATCH)

        redisTemplate.deleteVerificationCode(request.phoneNo)

        return UUID.randomUUID().toString().also { verifiedToken ->
            redisTemplate.saveVerifiedToken(request.phoneNo, verifiedToken)
        }
    }

    fun confirmPhoneNo(request: PhoneNoConfirmRequest) {
        userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)
    }

    private fun sendSms(phoneNo: String, code: String): Boolean {
        val message = Message().apply {
            from = smsFrom
            to = phoneNo
            text = buildVerificationCodeMessage(code)
        }

        return messageService.sendOne(SingleMessageSendingRequest(message))
            ?.statusCode == COOLSMS_SUCCESS_CODE
    }

    private fun buildVerificationCodeMessage(code: String): String =
        "[빌리지] 인증번호는 [$code] 입니다.\n*절대 타인에게 노출하지 마세요.*"

    private fun generateVerificationCode(): String =
        SecureRandom().nextInt(10.pow(VERIFICATION_CODE_LENGTH))
            .let { "%0${VERIFICATION_CODE_LENGTH}d".format(it) }

    private fun verificationCodeKey(phoneNo: String): String = "$VERIFICATION_CODE_KEY_PREFIX$phoneNo"
    private fun verifiedTokenKey(phoneNo: String): String = "$VERIFIED_TOKEN_KEY_PREFIX$phoneNo"

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }

    /**
     * Redis Extension Functions
     */
    private fun StringRedisTemplate.getVerificationCode(phoneNo: String): String? =
        opsForValue().get(verificationCodeKey(phoneNo))

    private fun StringRedisTemplate.saveVerificationCode(phoneNo: String, code: String) {
        opsForValue().set(
            verificationCodeKey(phoneNo),
            code,
            verificationCodeExpiration,
            TimeUnit.MINUTES
        )
    }

    private fun StringRedisTemplate.deleteVerificationCode(phoneNo: String) {
        delete(verificationCodeKey(phoneNo))
    }

    private fun StringRedisTemplate.saveVerifiedToken(phoneNo: String, token: String) {
        opsForValue().set(
            verifiedTokenKey(phoneNo),
            token,
            verifiedTokenExpiration,
            TimeUnit.MINUTES
        )
    }
}