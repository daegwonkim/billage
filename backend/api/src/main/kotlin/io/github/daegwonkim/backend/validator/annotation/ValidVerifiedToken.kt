package io.github.daegwonkim.backend.validator.annotation

import io.github.daegwonkim.backend.validator.VerifiedTokenValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [VerifiedTokenValidator::class])
@MustBeDocumented
annotation class ValidVerifiedToken(
    val message: String = "인증토큰은 UUID 형식이어야 합니다",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
