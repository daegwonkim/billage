package io.github.daegwonkim.backend.aop.annotation

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class SmsRateLimit(
    /**
     * phoneNo를 추출할 SpEL 표현식.
     * 메서드 파라미터명을 참조할 수 있음.
     * 예: "#request.phoneNo"
     */
    val phoneNo: String
)
