package io.github.daegwonkim.backend.util

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class CookieUtil(
    @Value($$"${jwt.access-token-expiration.seconds}")
    private val accessTokenExpiration: Int,
    @Value($$"${jwt.refresh-token-expiration.seconds}")
    private val refreshTokenExpiration: Int
){
    fun createCookie(name: String, value: String, maxAge: Int): Cookie {
        return Cookie(name, value).apply {
            isHttpOnly = true
            secure = true
            path = "/"
            this.maxAge = maxAge
        }
    }

    fun createAccessTokenCookie(token: String): Cookie {
        return createCookie("accessToken", token, accessTokenExpiration)
    }

    fun createRefreshTokenCookie(token: String): Cookie {
        return createCookie("refreshToken", token, refreshTokenExpiration)
    }

    fun getTokenFromCookie(request: HttpServletRequest, cookieName: String): String? {
        return request.cookies?.firstOrNull { it.name == cookieName }?.value
    }

    fun deleteCookie(name: String): Cookie {
        return Cookie(name, null).apply {
            isHttpOnly = true
            secure = true
            path = "/"
            maxAge = 0
        }
    }
}