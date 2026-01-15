package io.github.daegwonkim.backend.exception.base.errorcode

import org.springframework.http.HttpStatus

enum class RentalItemErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    RENTAL_ITEM_NOT_FOUND("RENTAL_ITEM_NOT_FOUND", "존재하지 않는 상품입니다", HttpStatus.NOT_FOUND)
}