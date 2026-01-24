package io.github.daegwonkim.backend.redis

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.core.script.RedisScript
import org.springframework.stereotype.Component

@Component
class SmsRateLimitRedisRepository(
    private val stringRedisTemplate: StringRedisTemplate
) {
    companion object {
        private const val SHORT_TERM_PREFIX = "smsRateLimit:short:"
        private const val DAILY_PREFIX = "smsRateLimit:daily:"
        private const val SHORT_TERM_TTL_SECONDS = 60L
        private const val DAILY_TTL_SECONDS = 86400L
        private const val DAILY_LIMIT = 5L

        /**
         * Lua script: 조건 확인 + 카운트 증가를 원자적으로 수행
         *
         * KEYS[1] = short:phone key
         * KEYS[2] = short:ip key
         * KEYS[3] = daily:phone key
         * KEYS[4] = daily:ip key
         * ARGV[1] = daily limit
         * ARGV[2] = short term TTL (seconds)
         * ARGV[3] = daily TTL (seconds)
         *
         * Returns:
         *   0 = 성공 (슬롯 확보)
         *   1 = 전화번호 단기 제한 초과
         *   2 = IP 단기 제한 초과
         *   3 = 전화번호 일일 제한 초과
         *   4 = IP 일일 제한 초과
         */
        private val ACQUIRE_SCRIPT = RedisScript.of(
            """
            local shortPhone = KEYS[1]
            local shortIp = KEYS[2]
            local dailyPhone = KEYS[3]
            local dailyIp = KEYS[4]
            local dailyLimit = tonumber(ARGV[1])
            local shortTtl = tonumber(ARGV[2])
            local dailyTtl = tonumber(ARGV[3])

            if redis.call('EXISTS', shortPhone) == 1 then
                return 1
            end
            if redis.call('EXISTS', shortIp) == 1 then
                return 2
            end

            local phoneCount = tonumber(redis.call('GET', dailyPhone) or '0')
            if phoneCount >= dailyLimit then
                return 3
            end

            local ipCount = tonumber(redis.call('GET', dailyIp) or '0')
            if ipCount >= dailyLimit then
                return 4
            end

            redis.call('SET', shortPhone, '1', 'EX', shortTtl)
            redis.call('SET', shortIp, '1', 'EX', shortTtl)

            local newPhoneCount = redis.call('INCR', dailyPhone)
            if newPhoneCount == 1 then
                redis.call('EXPIRE', dailyPhone, dailyTtl)
            end

            local newIpCount = redis.call('INCR', dailyIp)
            if newIpCount == 1 then
                redis.call('EXPIRE', dailyIp, dailyTtl)
            end

            return 0
            """.trimIndent(),
            Long::class.java
        )

        /**
         * Lua script: SMS 발송 실패 시 롤백
         * 단기 제한 키 삭제 + 일일 카운트 차감
         */
        private val ROLLBACK_SCRIPT = RedisScript.of(
            """
            local shortPhone = KEYS[1]
            local shortIp = KEYS[2]
            local dailyPhone = KEYS[3]
            local dailyIp = KEYS[4]

            redis.call('DEL', shortPhone, shortIp)
            redis.call('DECR', dailyPhone)
            redis.call('DECR', dailyIp)

            return 0
            """.trimIndent(),
            Long::class.java
        )
    }

    /**
     * 원자적으로 rate limit 확인 및 슬롯 확보.
     * @return 0이면 성공, 그 외는 제한 사유 코드
     */
    fun acquireSlot(phoneNo: String, ip: String): Long {
        val keys = listOf(
            "$SHORT_TERM_PREFIX$phoneNo",
            "$SHORT_TERM_PREFIX$ip",
            "$DAILY_PREFIX$phoneNo",
            "$DAILY_PREFIX$ip"
        )
        return stringRedisTemplate.execute(
            ACQUIRE_SCRIPT,
            keys,
            DAILY_LIMIT.toString(),
            SHORT_TERM_TTL_SECONDS.toString(),
            DAILY_TTL_SECONDS.toString()
        ) ?: 0L
    }

    /**
     * SMS 발송 실패 시 확보한 슬롯 롤백.
     */
    fun releaseSlot(phoneNo: String, ip: String) {
        val keys = listOf(
            "$SHORT_TERM_PREFIX$phoneNo",
            "$SHORT_TERM_PREFIX$ip",
            "$DAILY_PREFIX$phoneNo",
            "$DAILY_PREFIX$ip"
        )
        stringRedisTemplate.execute(ROLLBACK_SCRIPT, keys)
    }
}
