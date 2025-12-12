package io.github.daegwonkim.backend.coolsms

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "coolsms")
data class CoolsmsProperties(
    val url: String,
    val apiKey: String,
    val secretKey: String
)