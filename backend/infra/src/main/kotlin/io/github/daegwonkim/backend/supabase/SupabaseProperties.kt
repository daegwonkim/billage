package io.github.daegwonkim.backend.supabase

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "supabase")
data class SupabaseProperties(
    val url: String,
    val apiKey: String
)