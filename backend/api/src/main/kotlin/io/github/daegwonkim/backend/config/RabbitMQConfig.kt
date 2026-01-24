package io.github.daegwonkim.backend.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.FanoutExchange
import org.springframework.amqp.core.Queue
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.UUID

@Configuration
class RabbitMQConfig(
    @Value($$"${chat.exchange-name}")
    private val exchangeName: String
) {

    private val instanceId: String = UUID.randomUUID().toString()

    @Bean
    fun chatBroadcastExchange(): FanoutExchange =
        FanoutExchange(exchangeName, true, false)

    @Bean
    fun chatInstanceQueue(): Queue =
        Queue("$exchangeName.$instanceId", false, true, true)

    @Bean
    fun chatQueueBinding(chatBroadcastExchange: FanoutExchange, chatInstanceQueue: Queue): Binding =
        BindingBuilder.bind(chatInstanceQueue).to(chatBroadcastExchange)
}
