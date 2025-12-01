package io.github.daegwonkim.backend.controller;

import io.github.daegwonkim.backend.dto.auth.request.*;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/auth")
public class AuthController {

    @Operation(
            summary = "본인인증",
            description = "이름, 생년월일, 성별, 휴대폰 정보를 통해 본인인증을 수행합니다."
    )
    @PostMapping("/identity/verify")
    public void identityVerification(@RequestBody IdentityVerificationRequest request) {}

    @Operation(
            summary = "인증번호 전송",
            description = "사용자에게 인증번호를 전송합니다."
    )
    @PostMapping("/verification-code/send")
    public void verificationCodeSend(@RequestBody VerificationCodeSendRequest request) {}

    @Operation(
            summary = "인증번호 검증",
            description = "사용자가 입력한 인증번호를 검증합니다."
    )
    @PostMapping("/verification-code/verify")
    public void codeVerification(@RequestBody CodeVerificationRequest request) {}

    @Operation(
            summary = "휴대폰 번호 검증",
            description = "기존 계정에 존재하는 휴대폰 번호인지 검증합니다."
    )
    @PostMapping("/phone-number/verify")
    public void signin(@RequestBody PhoneNumberVerificationRequest request) {}

    @Operation(
            summary = "회원가입",
            description = "사용자의 새로운 계정을 생성합니다."
    )
    @PostMapping("/signup")
    public void signup(@RequestBody UserSignupRequest request) {}

    @Operation(
            summary = "로그인",
            description = "기존 계정으로 로그인합니다."
    )
    @PostMapping("/signin")
    public void signin(@RequestBody UserSigninRequest request) {}
}
