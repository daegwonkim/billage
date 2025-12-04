package io.github.daegwonkim.backend.common.jwt

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.concurrent.TimeUnit

@Service
class RefreshTokenService(
    private val stringRedisTemplate: StringRedisTemplate,
    @Value($$"${jwt.refresh-token-expiration}")
    private val refreshTokenExpiration: Long
) {
    companion object {
        private const val REFRESH_TOKEN_PREFIX = "refreshToken:"
    }

    /**
     * RefreshToken 저장
     */
    fun saveRefreshToken(userId: UUID, refreshToken: String) {
        val key = REFRESH_TOKEN_PREFIX + userId
        stringRedisTemplate.opsForValue().set(
            key,
            refreshToken,
            refreshTokenExpiration,
            TimeUnit.MILLISECONDS
        )
    }

    /**
     * RefreshToken 조회
     */
    fun getRefreshToken(userId: UUID): String? {
        val key = REFRESH_TOKEN_PREFIX + userId
        return stringRedisTemplate.opsForValue().get(key)
    }

    /**
     * RefreshToken 삭제 (로그아웃 시)
     */
    fun deleteRefreshToken(userId: UUID) {
        val key = REFRESH_TOKEN_PREFIX + userId
        stringRedisTemplate.delete(key)
    }
}