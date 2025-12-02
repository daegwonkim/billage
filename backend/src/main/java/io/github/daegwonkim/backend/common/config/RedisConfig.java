package io.github.daegwonkim.backend.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.daegwonkim.backend.common.properties.RedisProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories
@EnableCaching
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig {

    @Bean
    public LettuceConnectionFactory lettuceConnectionFactory(RedisProperties redisProperties) {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisProperties.host());
        redisConfig.setPort(redisProperties.port());
        redisConfig.setPassword(RedisPassword.of(redisProperties.password()));

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .useSsl()
                .build();

        return new LettuceConnectionFactory(redisConfig, clientConfig);
    }

    @Bean
    public <T> RedisTemplate<String, T> redisTemplate(
            RedisConnectionFactory redisConnectionFactory,
            ObjectMapper objectMapper) {
        RedisTemplate<String, T> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper));
        return redisTemplate;
    }
}
