package io.github.daegwonkim.backend.redis

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class RefreshTokenRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate,
    @Value($$"${jwt.refresh-token-expiration.milliseconds}")
    private val refreshTokenExpiration: Long
) {
    companion object {
        private const val REFRESH_TOKEN_PREFIX = "refreshToken:"
    }

    fun save(userId: Long, refreshToken: String) {
        val key = REFRESH_TOKEN_PREFIX + userId
        stringRedisTemplate.opsForValue().set(
            key,
            refreshToken,
            refreshTokenExpiration,
            TimeUnit.MILLISECONDS
        )
    }

    fun find(userId: Long): String? {
        val key = REFRESH_TOKEN_PREFIX + userId
        return stringRedisTemplate.opsForValue().get(key)
    }

    fun delete(userId: Long): Boolean {
        val key = REFRESH_TOKEN_PREFIX + userId
        return stringRedisTemplate.delete(key)
    }
}