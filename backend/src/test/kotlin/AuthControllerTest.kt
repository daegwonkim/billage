import io.kotest.core.spec.style.BehaviorSpec
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.daegwonkim.backend.common.exception.ErrorCode
import io.github.daegwonkim.backend.common.exception.ExternalServiceException
import io.github.daegwonkim.backend.common.exception.GlobalExceptionHandler
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.controller.AuthController
import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.service.AuthService
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print

class AuthControllerTest : BehaviorSpec({
    val authService = mockk<AuthService>()
    val controller = AuthController(authService)
    val globalExceptionHandler = GlobalExceptionHandler()
    val mockMvc: MockMvc = MockMvcBuilders.standaloneSetup(controller)
        .setControllerAdvice(globalExceptionHandler)
        .build()
    val objectMapper = ObjectMapper()

    Given("인증번호 전송 요청이 들어올 때") {
        val request = VerificationCodeSendRequest(phoneNo = "01012345678")
        val requestBody = objectMapper.writeValueAsString(request)

        When("유효한 휴대폰 번호로 요청하면") {
            every { authService.sendVerificationCode(any()) } returns Unit

            val response = mockMvc.perform(
                post("/api/auth/verification-code/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("인증번호가 전송되고 200 응답을 반환한다") {
                response.andExpect(status().isOk)
                verify(exactly = 1) { authService.sendVerificationCode(request) }
            }
        }

        When("SMS 전송에 실패하면") {
            every { authService.sendVerificationCode(any()) } throws
                    ExternalServiceException(ErrorCode.SMS_SEND_FAILED)

            val response = mockMvc.perform(
                post("/api/auth/verification-code/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            ).andDo { print() }

            Then("예외가 발생한다") {
                response.andExpect(status().is5xxServerError)
            }
        }
    }

    Given("인증번호 검증 요청이 들어올 때") {
        val request = VerificationCodeConfirmRequest(
            phoneNo = "01012345678",
            verificationCode = "123456"
        )
        val requestBody = objectMapper.writeValueAsString(request)

        When("올바른 인증번호로 요청하면") {
            val verifiedToken = "test-verified-token"
            every { authService.confirmVerificationCode(any()) } returns VerificationCodeConfirmResponse(verifiedToken)

            val response = mockMvc.perform(
                post("/api/auth/verification-code/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("인증 토큰을 반환한다") {
                response.andExpect(status().isOk)
                    .andExpect(jsonPath("$.verifiedToken").value(verifiedToken))
                verify(exactly = 1) { authService.confirmVerificationCode(request) }
            }
        }

        When("인증번호가 일치하지 않으면") {
            every { authService.confirmVerificationCode(any()) } throws
                    NotFoundException(ErrorCode.VERIFICATION_CODE_MISMATCH)

            val response = mockMvc.perform(
                post("/api/auth/verification-code/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("400 예외가 발생한다") {
                response.andExpect(status().isBadRequest)
            }
        }

        When("인증번호가 존재하지 않거나 만료되었으면") {
            every { authService.confirmVerificationCode(any()) } throws
                    NotFoundException(ErrorCode.VERIFICATION_CODE_NOT_FOUND)

            val response = mockMvc.perform(
                post("/api/auth/verification-code/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("404 예외가 발생한다") {
                response.andExpect(status().isNotFound)
            }
        }
    }

    Given("휴대폰 번호 검증 요청이 들어올 때") {
        val request = PhoneNoConfirmRequest(phoneNo = "01012345678")
        val requestBody = objectMapper.writeValueAsString(request)

        When("등록된 휴대폰 번호로 요청하면") {
            every { authService.confirmPhoneNo(any()) } returns Unit

            val response = mockMvc.perform(
                post("/api/auth/phone-no/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("200 응답을 반환한다") {
                response.andExpect(status().isOk)
                verify(exactly = 1) { authService.confirmPhoneNo(request) }
            }
        }

        When("등록되지 않은 휴대폰 번호로 요청하면") {
            every { authService.confirmPhoneNo(any()) } throws
                    NotFoundException(ErrorCode.USER_NOT_FOUND)

            val response = mockMvc.perform(
                post("/api/auth/phone-no/confirm")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody)
            )

            Then("404 예외가 발생한다") {
                response.andExpect(status().isNotFound)
            }
        }
    }
})