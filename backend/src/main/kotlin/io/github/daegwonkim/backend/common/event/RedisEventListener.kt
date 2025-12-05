package io.github.daegwonkim.backend.common.event

import io.github.daegwonkim.backend.repository.RefreshTokenRedisRepository
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenDeleteEvent
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenSaveEvent
import io.github.daegwonkim.backend.common.event.dto.VerifiedTokenDeleteEvent
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class RedisEventListener(
    private val stringRedisTemplate: StringRedisTemplate,
    private val refreshTokenRedisRepository: RefreshTokenRedisRepository
) {
    companion object {
        private const val VERIFIED_TOKEN_KEY_PREFIX = "verifiedToken:"
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun handleVerifiedTokenDelete(event: VerifiedTokenDeleteEvent) {
        stringRedisTemplate.delete(verifiedTokenKey(event.phoneNo))
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun handleRefreshTokenSave(event: RefreshTokenSaveEvent) {
        refreshTokenRedisRepository.save(event.userId, event.refreshToken)
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun handleRefreshTokenDelete(event: RefreshTokenDeleteEvent) {
        refreshTokenRedisRepository.delete(event.userId)
    }

    private fun verifiedTokenKey(phoneNo: String): String =
        "$VERIFIED_TOKEN_KEY_PREFIX$phoneNo"
}