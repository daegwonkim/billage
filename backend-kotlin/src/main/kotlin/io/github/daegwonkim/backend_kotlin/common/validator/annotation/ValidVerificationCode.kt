package io.github.daegwonkim.backend_kotlin.common.validator.annotation

import io.github.daegwonkim.backend_kotlin.common.validator.VerificationCodeValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [VerificationCodeValidator::class])
@MustBeDocumented
annotation class ValidVerificationCode(
    val message: String = "인증번호는 6자리 숫자여야 합니다",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
