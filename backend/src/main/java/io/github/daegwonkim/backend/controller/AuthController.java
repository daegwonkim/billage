package io.github.daegwonkim.backend.controller;

import io.github.daegwonkim.backend.dto.auth.request.*;
import io.github.daegwonkim.backend.service.VerificationCodeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final VerificationCodeService verificationCodeService;

    @Operation(
            summary = "인증번호 전송",
            description = "사용자에게 인증번호를 전송합니다."
    )
    @PostMapping("/verification-code/send")
    public void sendVerificationCode(@Valid @RequestBody VerificationCodeSendRequest request) {
        verificationCodeService.sendVerificationCode(request.phoneNo());
    }

    @Operation(
            summary = "인증번호 검증",
            description = "사용자가 입력한 인증번호를 검증합니다."
    )
    @PostMapping("/verification-code/confirm")
    public void confirmVerificationCode(@Valid @RequestBody VerificationCodeConfirmRequest request) {
        verificationCodeService.confirmVerificationCode(request.phoneNo(), request.verificationCode());
    }
}
