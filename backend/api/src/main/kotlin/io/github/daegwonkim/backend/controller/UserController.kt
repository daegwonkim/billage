package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.user.GetMeResponse
import io.github.daegwonkim.backend.dto.user.GetUserRentalItemsResponse
import io.github.daegwonkim.backend.service.UserService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자 정보를 조회합니다")
    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal userId: Long): GetMeResponse {
        return userService.getMe(userId)
    }

    @Operation(summary = "대여 상품 목록 조회", description = "사용자가 대여 상품으로 등록한 상품 목록을 조회합니다")
    @GetMapping("/{id}/rental-items")
    fun getUserRentalItems(
        @PathVariable("id") id: Long,
        @RequestParam(required = false) excludeRentalItemId: Long?,
    ): GetUserRentalItemsResponse {
        return userService.getUserRentalItems(id, excludeRentalItemId)
    }
}