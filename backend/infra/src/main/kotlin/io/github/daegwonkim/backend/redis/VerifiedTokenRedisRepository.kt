package io.github.daegwonkim.backend.redis

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component
import java.util.UUID
import java.util.concurrent.TimeUnit
import kotlin.text.get
import kotlin.text.set

@Component
class VerifiedTokenRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate,
    @Value($$"${verified-token.expiration}")
    private val verifiedTokenExpiration: Long
) {
    companion object {
        private const val VERIFIED_TOKEN_KEY_PREFIX = "verifiedToken:"
    }

    fun find(phoneNo: String): String? =
        stringRedisTemplate.opsForValue().get(verifiedTokenKey(phoneNo))

    fun save(phoneNo: String, verifiedToken: UUID) {
        stringRedisTemplate.opsForValue().set(
            verifiedTokenKey(phoneNo),
            verifiedToken.toString(),
            verifiedTokenExpiration,
            TimeUnit.MINUTES
        )
    }

    private fun verifiedTokenKey(phoneNo: String) = "$VERIFIED_TOKEN_KEY_PREFIX$phoneNo"
}