package io.github.daegwonkim.backend.common.jwt

import io.github.daegwonkim.backend.logger
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value($$"${jwt.secret}")
    private val secret: String,
    @Value($$"${jwt.access-token-expiration}")
    private val accessTokenExpiration: Long,
    @Value($$"${jwt.refresh-token-expiration}")
    private val refreshTokenExpiration: Long
) {
    private val secretKey : SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateAccessToken(userId: UUID): String =
        buildToken(userId, accessTokenExpiration, "ACCESS")

    fun generateRefreshToken(userId: UUID): String =
        buildToken(userId, refreshTokenExpiration, "REFRESH")

    fun getUserIdFromToken(token: String): UUID {
        return UUID.fromString(getClaims(token).subject)
    }

    fun validateToken(token: String): Boolean {
        return try {
            getClaims(token)
            true
        } catch (e: Exception) {
            logger.warn { "Invalid JWT: ${e.message}" }
            false
        }
    }

    // Private helper methods

    private fun buildToken(userId: UUID, expiry: Long, type: String): String {
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