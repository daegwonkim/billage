package io.github.daegwonkim.backend.jwt

import io.github.daegwonkim.backend.log.logger
import io.github.daegwonkim.backend.jwt.vo.GeneratedTokens
import io.github.daegwonkim.backend.jwt.vo.TokenClaims
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
    @Value($$"${jwt.access-token-expiration}")
    private val accessTokenExpiration: Long,
    @Value($$"${jwt.refresh-token-expiration}")
    private val refreshTokenExpiration: Long
) {
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateToken(userId: Long, familyId: String, version: Int): GeneratedTokens {
        val accessToken = buildAccessToken(userId)
        val refreshToken = buildRefreshToken(userId, familyId, version)

        return GeneratedTokens(accessToken, refreshToken)
    }

    fun validateAndGetClaims(token: String): TokenClaims {
        val claims = getClaims(token)
        val userId = claims.subject.toLong()
        val familyId = claims["familyId"] as String
        val version = claims["version"] as Int

        return TokenClaims(userId, familyId, version)
    }

    fun validateAndGetUserIdOrNull(token: String): Long? {
        return runCatching { getClaims(token).subject.toLong() }
            .onFailure { logger.warn { "유효하지 않은 JWT 토큰: token=$token, message=${it.message}" } }
            .getOrNull()
    }

    // Private helper methods

    private fun buildAccessToken(userId: Long): String {
        val now = Date()
        return Jwts.builder()
            .issuer("BILLAGE")
            .subject(userId.toString())
            .claim("type", "ACCESS")
            .issuedAt(now)
            .expiration(Date(now.time + accessTokenExpiration))
            .signWith(secretKey)
            .compact()
    }

    private fun buildRefreshToken(userId: Long, familyId: String, version: Int): String {
        val now = Date()
        return Jwts.builder()
            .issuer("BILLAGE")
            .subject(userId.toString())
            .claim("type", "REFRESH")
            .claim("familyId", familyId)
            .claim("version", version)
            .issuedAt(now)
            .expiration(Date(now.time + refreshTokenExpiration))
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