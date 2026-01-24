package io.github.daegwonkim.backend.aop

import io.github.daegwonkim.backend.aop.annotation.SmsRateLimit
import io.github.daegwonkim.backend.service.SmsRateLimitService
import jakarta.servlet.http.HttpServletRequest
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

@Aspect
@Component
class SmsRateLimitAspect(
    private val smsRateLimitService: SmsRateLimitService
) {
    private val spelParser = SpelExpressionParser()

    @Around("@annotation(smsRateLimit)")
    fun around(joinPoint: ProceedingJoinPoint, smsRateLimit: SmsRateLimit): Any? {
        val phoneNo = extractPhoneNo(joinPoint, smsRateLimit.phoneNo)
        val clientIp = extractClientIp()

        smsRateLimitService.acquireSlot(phoneNo, clientIp)

        return try {
            joinPoint.proceed()
        } catch (e: Exception) {
            smsRateLimitService.releaseSlot(phoneNo, clientIp)
            throw e
        }
    }

    private fun extractPhoneNo(joinPoint: ProceedingJoinPoint, expression: String): String {
        val signature = joinPoint.signature as MethodSignature
        val parameterNames = signature.parameterNames
        val args = joinPoint.args

        val context = StandardEvaluationContext()
        parameterNames.forEachIndexed { index, name ->
            context.setVariable(name, args[index])
        }

        return spelParser.parseExpression(expression).getValue(context, String::class.java)
            ?: throw IllegalArgumentException("phoneNo SpEL 표현식 평가 결과가 null입니다: $expression")
    }

    private fun extractClientIp(): String {
        val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes)
            .request
        return request.getHeader("X-Forwarded-For")?.split(",")?.first()?.trim()
            ?: request.remoteAddr
    }
}
