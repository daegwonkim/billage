package io.github.daegwonkim.backend.common.config

import io.github.daegwonkim.backend.common.properties.CoolsmsProperties
import net.nurigo.sdk.NurigoApp
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(CoolsmsProperties::class)
class CoolsmsConfig {

    @Bean
    fun defaultMessageService(
        properties: CoolsmsProperties
    ): DefaultMessageService = NurigoApp.initialize(
        properties.apiKey,
        properties.secretKey,
        properties.url
    )
}