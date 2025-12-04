package io.github.daegwonkim.backend_kotlin.common.validator

import io.github.daegwonkim.backend_kotlin.common.validator.annotation.ValidVerifiedToken
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import java.util.UUID

class VerifiedTokenValidator : ConstraintValidator<ValidVerifiedToken, String> {

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        if (value.isBlank()) return false

        return try {
            UUID.fromString(value)
            true
        } catch (e: IllegalArgumentException) {
            false
        }
    }
}