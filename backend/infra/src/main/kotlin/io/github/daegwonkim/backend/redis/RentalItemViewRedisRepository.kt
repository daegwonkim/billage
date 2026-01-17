package io.github.daegwonkim.backend.redis

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class RentalItemViewRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate
) {
    companion object {
        private const val VIEW_KEY_PREFIX = "view:"
        private const val VIEW_EXPIRATION_HOURS = 24L
    }

    fun hasViewed(rentalItemId: Long, userId: Long?): Boolean {
        val key = viewKey(rentalItemId, userId)
        return stringRedisTemplate.hasKey(key)
    }

    fun markViewed(rentalItemId: Long, userId: Long?): Boolean {
        val key = viewKey(rentalItemId, userId)
        return stringRedisTemplate.opsForValue().setIfAbsent(
            key,
            "1",
            VIEW_EXPIRATION_HOURS,
            TimeUnit.HOURS
        ) ?: false
    }

    private fun viewKey(rentalItemId: Long, userId: Long?) =
        "$VIEW_KEY_PREFIX$rentalItemId:$userId"
}
