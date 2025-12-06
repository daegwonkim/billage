package io.github.daegwonkim.backend.repository

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class VerificationCodeRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate,
    @Value($$"${verification-code.expiration}")
    private val verificationCodeExpiration: Long
) {
    companion object {
        private const val VERIFICATION_CODE_KEY_PREFIX = "verificationCode:"
    }

    fun find(phoneNo: String): String? =
        stringRedisTemplate.opsForValue().get(verificationCodeKey(phoneNo))

    fun save(phoneNo: String, verificationCode: String) {
        stringRedisTemplate.opsForValue().set(
            verificationCodeKey(phoneNo),
            verificationCode,
            verificationCodeExpiration,
            TimeUnit.MINUTES
        )
    }

    fun delete(phoneNo: String): Boolean =
        stringRedisTemplate.delete(verificationCodeKey(phoneNo))

    private fun verificationCodeKey(phoneNo: String) = "$VERIFICATION_CODE_KEY_PREFIX$phoneNo"
}