package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.exception.errorcode.AuthErrorCode
import io.github.daegwonkim.backend.redis.SmsRateLimitRedisRepository
import org.springframework.stereotype.Service

@Service
class SmsRateLimitService(
    private val smsRateLimitRedisRepository: SmsRateLimitRedisRepository
) {

    /**
     * 원자적으로 rate limit 확인 및 슬롯 확보.
     * 제한 초과 시 예외 throw.
     */
    fun acquireSlot(phoneNo: String, ip: String) {
        val phoneKey = "phone:$phoneNo"
        val ipKey = "ip:$ip"

        val result = smsRateLimitRedisRepository.acquireSlot(phoneKey, ipKey)

        if (result != 0L) {
            val logMessage = when (result) {
                1L -> "SMS 단기 발송 제한 초과: phone=$phoneNo"
                2L -> "SMS 단기 발송 제한 초과: ip=$ip"
                3L -> "SMS 일일 발송 제한 초과: phone=$phoneNo"
                4L -> "SMS 일일 발송 제한 초과: ip=$ip"
                else -> "SMS 발송 제한 초과"
            }
            throw AuthenticationException(AuthErrorCode.SMS_RATE_LIMIT_EXCEEDED, logMessage)
        }
    }

    /**
     * SMS 발송 실패 시 확보한 슬롯 롤백.
     */
    fun releaseSlot(phoneNo: String, ip: String) {
        val phoneKey = "phone:$phoneNo"
        val ipKey = "ip:$ip"
        smsRateLimitRedisRepository.releaseSlot(phoneKey, ipKey)
    }
}
