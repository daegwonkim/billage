package io.github.daegwonkim.backend.jwt

import io.github.daegwonkim.backend.exception.base.ErrorCode
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.log.logger
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value($$"${jwt.secret}")
    private val secret: String,
    @Value($$"${jwt.access-token-expiration.milliseconds}")
    private val accessTokenExpiration: Long,
    @Value($$"${jwt.refresh-token-expiration.milliseconds}")
    private val refreshTokenExpiration: Long
) {
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateAccessToken(userId: Long): String =
        buildToken(userId, accessTokenExpiration, "ACCESS")

    fun generateRefreshToken(userId: Long): String =
        buildToken(userId, refreshTokenExpiration, "REFRESH")

    fun validateAndGetUserId(token: String): Long {
        return runCatching { getClaims(token).subject.toLong() }
            .getOrElse {
                throw AuthenticationException(ErrorCode.AUTHENTICATION_FAILED,
                "유효하지 않은 JWT 토큰: token=$token")
            }
    }

    fun validateAndGetUserIdOrNull(token: String): Long? {
        return runCatching { getClaims(token).subject.toLong() }
            .onFailure { logger.warn { "유효하지 않은 JWT: token=$token, message=${it.message}" } }
            .getOrNull()
    }

    // Private helper methods

    private fun buildToken(userId: Long, expiry: Long, type: String): String {
        val now = Date()
        return Jwts.builder()
            .subject(userId.toString())
            .claim("type", type)
            .issuedAt(now)
            .expiration(Date(now.time + expiry))
            .signWith(secretKey)
            .compact()
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}