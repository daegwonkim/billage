package io.github.daegwonkim.backend.common.validator

import io.github.daegwonkim.backend.common.validator.annotation.ValidVerificationCode
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class VerificationCodeValidator : ConstraintValidator<ValidVerificationCode, String> {

    companion object {
        private val VERIFICATION_CODE_REGEX = "^\\d{6}$".toRegex()
    }

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        return when {
            value == null -> true
            value.isBlank() -> false
            else -> value.matches(VERIFICATION_CODE_REGEX)
        }
    }
}