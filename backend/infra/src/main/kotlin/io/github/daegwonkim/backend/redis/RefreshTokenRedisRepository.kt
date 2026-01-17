package io.github.daegwonkim.backend.redis

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class RefreshTokenRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate,
    @Value($$"${jwt.refresh-token-expiration}")
    private val refreshTokenExpiration: Long
) {
    companion object {
        private const val REFRESH_TOKEN_PREFIX = "refreshToken:"
    }

    fun save(familyId: String, version: Int) {
        val key = REFRESH_TOKEN_PREFIX + familyId
        stringRedisTemplate.opsForValue().set(
            key,
            version.toString(),
            refreshTokenExpiration,
            TimeUnit.MILLISECONDS
        )
    }

    fun find(familyId: String): Int? {
        val key = REFRESH_TOKEN_PREFIX + familyId
        return stringRedisTemplate.opsForValue().get(key)?.toIntOrNull()
    }

    fun delete(familyId: String): Boolean {
        val key = REFRESH_TOKEN_PREFIX + familyId
        return stringRedisTemplate.delete(key)
    }
}
