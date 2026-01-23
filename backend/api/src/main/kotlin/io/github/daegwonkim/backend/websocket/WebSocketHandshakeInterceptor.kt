package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.util.CookieUtil
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor

@Component
class WebSocketHandshakeInterceptor(
    private val jwtTokenProvider: JwtTokenProvider,
    private val cookieUtil: CookieUtil
) : HandshakeInterceptor {

    companion object {
        const val USER_ID_KEY = "userId"
        const val USER_NICKNAME_KEY = "userNickname"
    }

    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        if (request !is ServletServerHttpRequest) {
            return false
        }

        val token = cookieUtil.getTokenFromCookie(request, "accessToken")
            ?: return false

        val claims = jwtTokenProvider.getAccessTokenClaims(token)
            ?: return false

        attributes[USER_ID_KEY] = claims.userId
        attributes[USER_NICKNAME_KEY] = claims.userNickname

        return true
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {
        // Nothing to do
    }
}