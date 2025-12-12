package io.github.daegwonkim.backend.validator

import io.github.daegwonkim.backend.validator.annotation.ValidPhoneNo
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class PhoneNoValidator : ConstraintValidator<ValidPhoneNo, String> {

    companion object {
        private val PHONE_NO_REGEX = "^01[0-9]{8,9}$".toRegex()
    }

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        return when {
            value == null -> true
            value.isBlank() -> false
            else -> value.matches(PHONE_NO_REGEX)
        }
    }
}