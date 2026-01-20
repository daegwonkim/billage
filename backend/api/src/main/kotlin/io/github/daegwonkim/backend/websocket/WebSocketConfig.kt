package io.github.daegwonkim.backend.websocket

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig(
    private val webSocketHandshakeInterceptor: WebSocketHandshakeInterceptor
) : WebSocketMessageBrokerConfigurer {

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        // 클라이언트가 구독할 prefix (서버 -> 클라이언트)
        registry.enableSimpleBroker("/topic", "/queue")
        // 클라이언트가 메시지를 보낼 prefix (클라이언트 -> 서버)
        registry.setApplicationDestinationPrefixes("/app")
        // 특정 사용자에게 메시지를 보낼 prefix
        registry.setUserDestinationPrefix("/user")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("https://billage.vercel.app", "http://localhost:5173", "https://localhost:5173")
            .addInterceptors(webSocketHandshakeInterceptor)
            .withSockJS()

        // SockJS 없이 순수 WebSocket 연결도 지원
        registry.addEndpoint("/ws")
            .setAllowedOrigins("https://billage.vercel.app", "http://localhost:5173", "https://localhost:5173")
            .addInterceptors(webSocketHandshakeInterceptor)
    }
}
