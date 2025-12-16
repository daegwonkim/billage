package io.github.daegwonkim.backend.supabase

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.web.client.RestClient

@Configuration
@EnableConfigurationProperties(SupabaseProperties::class)
class SupabaseConfig {

    @Bean
    fun supabaseRestClient(properties: SupabaseProperties): RestClient =
        RestClient.builder()
            .baseUrl(properties.url)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer ${properties.apiKey}")
            .defaultHeader("apiKey", properties.apiKey)
            .build()
}