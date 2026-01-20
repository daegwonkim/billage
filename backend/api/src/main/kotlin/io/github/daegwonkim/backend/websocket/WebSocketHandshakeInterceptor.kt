package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.log.logger
import io.github.daegwonkim.backend.repository.UserRepository
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor

@Component
class WebSocketHandshakeInterceptor(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository
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
        if (request is ServletServerHttpRequest) {
            val token = getTokenFromCookie(request)
            if (token != null) {
                val userId = jwtTokenProvider.getSubject(token)
                if (userId != null) {
                    val user = userRepository.findById(userId).orElse(null)
                    if (user != null) {
                        attributes[USER_ID_KEY] = user.id
                        attributes[USER_NICKNAME_KEY] = user.nickname
                        return true
                    }
                }
            }
        }
        // 인증 실패해도 연결은 허용 (메시지 전송 시 검증)
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

    private fun getTokenFromCookie(request: ServletServerHttpRequest): String? {
        return request.servletRequest.cookies
            ?.find { it.name == "accessToken" }
            ?.value
    }
}
