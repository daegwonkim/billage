package io.github.daegwonkim.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.daegwonkim.backend.common.exception.ErrorCode;
import io.github.daegwonkim.backend.dto.auth.request.VerificationCodeConfirmRequest;
import io.github.daegwonkim.backend.dto.auth.request.VerificationCodeSendRequest;
import io.github.daegwonkim.backend.service.VerificationCodeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController 테스트")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private VerificationCodeService verificationCodeService;

    private static final String TEST_PHONE = "01012345678";
    private static final String TEST_CODE = "123456";

    private static final String VERIFICATION_CODE_SEND_API_URL = "/api/auth/verification-code/send";
    private static final String VERIFICATION_CODE_CONFIRM_API_URL = "/api/auth/verification-code/confirm";

    @Test
    @DisplayName("인증번호 전송 성공")
    void sendVerificationCode_Success() throws Exception {
        // given
        VerificationCodeSendRequest request = new VerificationCodeSendRequest(TEST_PHONE);

        willDoNothing().given(verificationCodeService)
                .sendVerificationCode(anyString());

        // when & then
        mockMvc.perform(post(VERIFICATION_CODE_SEND_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk());

        then(verificationCodeService).should(times(1))
                .sendVerificationCode(request.phoneNo());
    }

    @Test
    @DisplayName("잘못된 전화번호 형식으로 인해 인증번호 전송 실패")
    void sendVerificationCode_InvalidPhoneNo() throws Exception {
        // given
        VerificationCodeSendRequest request = new VerificationCodeSendRequest("12345");

        // when & then
        mockMvc.perform(post(VERIFICATION_CODE_SEND_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_INPUT_VALUE.getCode()))
                .andExpect(jsonPath("$.errors[0].field").value("phoneNo"));

        then(verificationCodeService).should(never())
                .sendVerificationCode(anyString());
    }

    @Test
    @DisplayName("인증번호 검증 성공")
    void confirmVerificationCode_Success() throws Exception {
        // given
        VerificationCodeConfirmRequest request = new VerificationCodeConfirmRequest(TEST_PHONE, TEST_CODE);

        willDoNothing().given(verificationCodeService)
                .confirmVerificationCode(anyString(), anyString());

        // when & then
        mockMvc.perform(post(VERIFICATION_CODE_CONFIRM_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk());

        then(verificationCodeService).should(times(1))
                .confirmVerificationCode(request.phoneNo(), request.verificationCode());
    }

    @Test
    @DisplayName("잘못된 전화번호, 인증번호 형식으로 인해 인증번호 검증 실패")
    void confirmVerificationCode_InvalidPhoneNoAndVerificationCode() throws Exception {
        // given
        VerificationCodeConfirmRequest request = new VerificationCodeConfirmRequest("12345", "12345");

        willDoNothing().given(verificationCodeService)
                .confirmVerificationCode(anyString(), anyString());

        // when & then
        mockMvc.perform(post(VERIFICATION_CODE_CONFIRM_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_INPUT_VALUE.getCode()))
                .andExpect(jsonPath("$.errors[0].field").value("phoneNo"))
                .andExpect(jsonPath("$.errors[1].field").value("verificationCode"));

        then(verificationCodeService).should(never())
                .confirmVerificationCode(anyString(), anyString());
    }
}
