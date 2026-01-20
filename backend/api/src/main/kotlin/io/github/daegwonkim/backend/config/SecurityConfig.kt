package io.github.daegwonkim.backend.config

import io.github.daegwonkim.backend.jwt.JwtAccessDeniedHandler
import io.github.daegwonkim.backend.jwt.JwtAuthenticationEntryPoint
import io.github.daegwonkim.backend.jwt.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint,
    private val jwtAccessDeniedHandler: JwtAccessDeniedHandler
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            csrf { disable() }
            cors { configurationSource = corsConfigurationSource() }
            sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }
            authorizeHttpRequests {
                // Public
                authorize("/api/auth/verification-code/**", permitAll)
                authorize("/api/auth/confirm-registered", permitAll)
                authorize("/api/auth/sign-up", permitAll)
                authorize("/api/auth/sign-in", permitAll)
                authorize("/api/auth/sign-out", permitAll)
                authorize("/api/auth/token/reissue", permitAll)
                authorize("/api/neighborhoods/**", permitAll)
                authorize("/api/users/*/profile", permitAll)
                authorize("/api/users/*/rental-items", permitAll)
                authorize("/health", permitAll)

                // Public Read
                authorize(HttpMethod.GET, "/api/rental-items/**", permitAll)

                // Authenticated
                authorize("/api/users/me", authenticated)

                // WebSocket
                authorize("/ws", authenticated)

                // Dev Tools
                authorize("/swagger-ui/**", permitAll)
                authorize("/v3/api-docs/**", permitAll)

                // Default
                authorize(anyRequest, authenticated)
            }
            exceptionHandling {
                authenticationEntryPoint = jwtAuthenticationEntryPoint
                accessDeniedHandler = jwtAccessDeniedHandler
            }
            addFilterBefore<UsernamePasswordAuthenticationFilter>(jwtAuthenticationFilter)
        }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration().apply {
            allowedOrigins = listOf("https://billage.vercel.app", "http://localhost:5173", "https://localhost:5173")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
}