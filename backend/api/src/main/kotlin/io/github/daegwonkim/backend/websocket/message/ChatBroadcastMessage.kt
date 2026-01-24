package io.github.daegwonkim.backend.websocket.message

enum class DestinationType {
    TOPIC,
    USER
}

data class BroadcastDestination(
    val type: DestinationType,
    val path: String,
    val userId: String? = null
)

data class ChatBroadcastMessage(
    val destinations: List<BroadcastDestination>,
    val payload: Any
)
