package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.log.logger
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import tools.jackson.core.type.TypeReference
import tools.jackson.databind.ObjectMapper

@Component
class ChatMessageRabbitMQConsumer(
    private val messagingTemplate: SimpMessagingTemplate,
    private val objectMapper: ObjectMapper
) {

    @RabbitListener(queues = ["#{chatInstanceQueue.name}"])
    fun handleMessage(payload: String) {
        try {
            val broadcasts: List<ChatBroadcastMessage> = objectMapper.readValue(
                payload,
                object : TypeReference<List<ChatBroadcastMessage>>() {}
            )

            for (broadcast in broadcasts) {
                for (destination in broadcast.destinations) {
                    val serializedPayload = objectMapper.writeValueAsString(broadcast.payload)
                    when (destination.type) {
                        DestinationType.TOPIC -> {
                            messagingTemplate.convertAndSend(destination.path, serializedPayload)
                        }
                        DestinationType.USER -> {
                            messagingTemplate.convertAndSendToUser(
                                destination.userId!!,
                                destination.path,
                                serializedPayload
                            )
                        }
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "RabbitMQ 메시지 처리 실패" }
        }
    }
}
