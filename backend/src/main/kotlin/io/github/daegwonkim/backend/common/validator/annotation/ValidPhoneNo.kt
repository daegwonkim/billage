package io.github.daegwonkim.backend.common.validator.annotation

import io.github.daegwonkim.backend.common.validator.PhoneNoValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [PhoneNoValidator::class])
@MustBeDocumented
annotation class ValidPhoneNo(
    val message: String = "올바른 전화번호 형식이 아닙니다",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
