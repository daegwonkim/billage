package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.user.GetProfileResponse
import io.github.daegwonkim.backend.dto.user.GetUserLikedRentalItemsResponse
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
    @Operation(summary = "내 프로필 조회", description = "나의 프로필 정보를 조회합니다")
    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal id: Long): GetProfileResponse {
        return userService.getProfile(id)
    }

    @Operation(summary = "사용자 프로필 조회", description = "다른 사용자의 프로필 정보를 조회합니다")
    @GetMapping("/{id}/profile")
    fun getProfile(@PathVariable("id") id: Long): GetProfileResponse {
        return userService.getProfile(id)
    }

    @Operation(summary = "대여 상품 목록 조회", description = "사용자가 대여 상품으로 등록한 상품 목록을 조회합니다")
    @GetMapping("/{id}/rental-items")
    fun getUserRentalItems(
        @PathVariable("id") id: Long,
        @RequestParam(required = false) excludeRentalItemId: Long?,
    ): GetUserRentalItemsResponse {
        return userService.getUserRentalItems(id, excludeRentalItemId)
    }

    @Operation(summary = "좋아요 목록 조회", description = "사용자가 좋아요를 등록한 대여 상품 목록을 조회합니다")
    @GetMapping("/rental-items/likes")
    fun getLikedRentalItems(@AuthenticationPrincipal id: Long): GetUserLikedRentalItemsResponse {
        return userService.getUserLikedRentalItems(id)
    }
}