package io.github.daegwonkim.backend.common.config;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoolsmsConfig {

    @Bean
    public DefaultMessageService defaultMessageService(
            @Value("${coolsms.url}") String coolsmsUrl,
            @Value("${coolsms.apiKey}") String coolsmsApiKey,
            @Value("${coolsms.secretKey}") String coolsmsSecretKey
    ) {
        return NurigoApp.INSTANCE.initialize(
                coolsmsApiKey,
                coolsmsSecretKey,
                coolsmsUrl
        );
    }
}
