package io.github.daegwonkim.backend.common.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import tools.jackson.databind.ObjectMapper

@Configuration
class RedisConfig {

    @Bean
    fun <T> redisTemplate(
        redisConnectionFactory: RedisConnectionFactory,
        objectMapper: ObjectMapper
    ): RedisTemplate<String, T> = RedisTemplate<String, T>().apply {
        connectionFactory = redisConnectionFactory
        keySerializer = StringRedisSerializer()
        valueSerializer = GenericJacksonJsonRedisSerializer(objectMapper)
    }
}