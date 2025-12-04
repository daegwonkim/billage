package io.github.daegwonkim.backend.common.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.SecurityException
import org.slf4j.LoggerFactory
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
    private val log = LoggerFactory.getLogger(javaClass)

    private val secretKey : SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    /**
     * AccessToken 생성
     */
    fun generateAccessToken(userId: UUID): String {
        val now = Date()
        val expiryDate = Date(now.time + accessTokenExpiration)

        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact()
    }

    /**
     * RefreshToken 생성
     */
    fun generateRefreshToken(userId: UUID): String {
        val now = Date()
        val expiryDate = Date(now.time + refreshTokenExpiration)

        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact()
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    fun getUserIdFromToken(token: String): UUID {
        return UUID.fromString(getClaims(token).subject)
    }

    /**
     * 토큰 유효성 검증
     */
    fun validateToken(token: String): Boolean {
        return try {
            getClaims(token)
            true
        } catch (e: Exception) {
            when (e) {
                is SecurityException -> log.warn("Security policy violation occurred: ${e.message}")
                is MalformedJwtException -> log.warn("Invalid JWT token format: ${e.message}")
                is ExpiredJwtException -> log.warn("Expired JWT token: ${e.message}")
                is UnsupportedJwtException -> log.warn("Unsupported JWT token: ${e.message}")
                is IllegalArgumentException -> log.warn("JWT claims string is empty: ${e.message}")
                is Exception -> log.warn("JWT validation error: ${e.message}")
            }
            false
        }
    }

    /**
     * Claims 추출
     */
    private fun getClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}