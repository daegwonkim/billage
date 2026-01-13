package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.user.MeResponse
import io.github.daegwonkim.backend.service.UserService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자 정보를 조회합니다")
    @GetMapping("/me")
    fun me(@AuthenticationPrincipal userId: Long): MeResponse {
        return userService.me(userId)
    }
}