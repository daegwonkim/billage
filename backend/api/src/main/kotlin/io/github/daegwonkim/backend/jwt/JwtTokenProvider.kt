package io.github.daegwonkim.backend.jwt

import io.github.daegwonkim.backend.jwt.vo.AccessTokenClaims
import io.github.daegwonkim.backend.log.logger
import io.github.daegwonkim.backend.jwt.vo.GeneratedTokens
import io.github.daegwonkim.backend.jwt.vo.RefreshTokenClaims
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

    fun generateToken(userId: Long, userNickname: String, familyId: String, version: Int): GeneratedTokens {
        val accessToken = buildAccessToken(userId, userNickname)
        val refreshToken = buildRefreshToken(userId, userNickname, familyId, version)

        return GeneratedTokens(accessToken, refreshToken)
    }

    fun getSubject(token: String): Long? {
        return runCatching {
            val claims = extractClaims(token)
            claims.subject.toLong()
        }.onFailure { logger.warn { "유효하지 않은 AccessToken: message=${it.message}" } }
            .getOrNull()
    }

    fun getAccessTokenClaims(token: String): AccessTokenClaims? {
        return runCatching {
            val claims = extractClaims(token)
            AccessTokenClaims(
                userId = claims.subject.toLong(),
                userNickname = claims["userNickname"] as String
            )
        }.onFailure { logger.warn { "유효하지 않은 AccessToken: message=${it.message}" } }
            .getOrNull()
    }

    fun getRefreshTokenClaims(token: String): RefreshTokenClaims? {
        return runCatching {
            val claims = extractClaims(token)
            RefreshTokenClaims(
                userId = claims.subject.toLong(),
                userNickname = claims["userNickname"] as String,
                familyId = claims["familyId"] as String,
                version = claims["version"] as Int
            )
        }.onFailure { logger.warn { "유효하지 않은 RefreshToken: message=${it.message}" } }
            .getOrNull()
    }

    // Private helper methods

    private fun buildAccessToken(userId: Long, userNickname: String): String {
        val now = Date()
        return Jwts.builder()
            .issuer("BILLAGE")
            .subject(userId.toString())
            .claim("type", "ACCESS")
            .claim("userNickname", userNickname)
            .issuedAt(now)
            .expiration(Date(now.time + accessTokenExpiration))
            .signWith(secretKey)
            .compact()
    }

    private fun buildRefreshToken(userId: Long, userNickname: String, familyId: String, version: Int): String {
        val now = Date()
        return Jwts.builder()
            .issuer("BILLAGE")
            .subject(userId.toString())
            .claim("type", "REFRESH")
            .claim("userNickname", userNickname)
            .claim("familyId", familyId)
            .claim("version", version)
            .issuedAt(now)
            .expiration(Date(now.time + refreshTokenExpiration))
            .signWith(secretKey)
            .compact()
    }

    private fun extractClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}