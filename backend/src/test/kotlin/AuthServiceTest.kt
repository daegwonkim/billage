import io.github.daegwonkim.backend.common.exception.ErrorCode
import io.github.daegwonkim.backend.common.exception.ExternalServiceException
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.common.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.common.jwt.RefreshTokenService
import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.SigninRequest
import io.github.daegwonkim.backend.dto.SignupRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenSaveEvent
import io.github.daegwonkim.backend.common.event.dto.VerifiedTokenDeleteEvent
import io.github.daegwonkim.backend.repository.UserRepository
import io.github.daegwonkim.backend.service.AuthService
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldMatch
import io.kotest.matchers.types.shouldBeInstanceOf
import io.mockk.*
import net.nurigo.sdk.message.response.SingleMessageSentResponse
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.core.ValueOperations
import java.util.UUID
import java.util.concurrent.TimeUnit

class AuthServiceTest : BehaviorSpec({
    val messageService = mockk<DefaultMessageService>()
    val refreshTokenService = mockk<RefreshTokenService>()
    val stringRedisTemplate = mockk<StringRedisTemplate>(relaxed = true)
    val jwtTokenProvider = mockk<JwtTokenProvider>()
    val valueOperations = mockk<ValueOperations<String, String>>(relaxed = true)
    val userRepository = mockk<UserRepository>()
    val eventPublisher = mockk<ApplicationEventPublisher>()

    val smsFrom = "01000000000"
    val verificationCodeExpiration = 5L
    val verifiedTokenExpiration = 1L

    val authService = AuthService(
        messageService = messageService,
        refreshTokenService = refreshTokenService,
        stringRedisTemplate = stringRedisTemplate,
        jwtTokenProvider = jwtTokenProvider,
        userRepository = userRepository,
        eventPublisher = eventPublisher,
        smsFrom = smsFrom,
        verificationCodeExpiration = verificationCodeExpiration,
        verifiedTokenExpiration = verifiedTokenExpiration
    )

    afterContainer {
        clearAllMocks()
    }

    Given("인증번호 전송 요청이 있을 때") {
        val phoneNo = "01012345678"
        val request = VerificationCodeSendRequest(phoneNo = phoneNo)

        When("SMS 전송에 성공하면") {
            val successResponse = mockk<SingleMessageSentResponse> {
                every { statusCode } returns "2000"
            }
            every { messageService.sendOne(any()) } returns successResponse
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every {
                valueOperations.set(
                    any(),
                    any(),
                    verificationCodeExpiration,
                    TimeUnit.MINUTES
                )
            } just Runs

            authService.sendVerificationCode(request)

            Then("SMS가 전송된다") {
                verify(exactly = 1) {
                    messageService.sendOne(any())
                }
            }

            Then("Redis에 인증번호가 저장된다") {
                verify(exactly = 1) {
                    valueOperations.set(
                        "verificationCode:$phoneNo",
                        match { it.matches(Regex("\\d{6}")) },
                        verificationCodeExpiration,
                        TimeUnit.MINUTES
                    )
                }
            }
        }

        When("SMS 전송에 실패하면") {
            val failResponse = mockk<SingleMessageSentResponse> {
                every { statusCode } returns "1010"
            }
            every { messageService.sendOne(any()) } returns failResponse

            val exception = runCatching {
                authService.sendVerificationCode(request)
            }.exceptionOrNull()

            Then("예외가 발생한다") {
                exception.shouldBeInstanceOf<ExternalServiceException>()
                    .errorCode shouldBe ErrorCode.SMS_SEND_FAILED
            }

            Then("Redis에 인증번호가 저장되지 않는다") {
                verify(exactly = 0) {
                    valueOperations.set(any(), any(), any(), any())
                }
            }
        }
    }

    Given("인증번호 검증 요청이 있을 때") {
        val phoneNo = "01012345678"
        val verificationCode = "123456"
        val request = VerificationCodeConfirmRequest(
            phoneNo = phoneNo,
            verificationCode = verificationCode
        )

        When("올바른 인증번호로 요청하면") {
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verificationCode:$phoneNo") } returns verificationCode
            every { stringRedisTemplate.delete(any<String>()) } returns true
            every {
                valueOperations.set(
                    "verifiedToken:$phoneNo",
                    any(),
                    verifiedTokenExpiration,
                    TimeUnit.MINUTES
                )
            } just Runs

            val response = authService.confirmVerificationCode(request)

            Then("인증토큰을 반환한다") {
                response.verifiedToken shouldNotBe null
                response.verifiedToken shouldMatch Regex("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")
            }

            Then("Redis에서 인증번호가 삭제된다") {
                verify(exactly = 1) {
                    stringRedisTemplate.delete("verificationCode:$phoneNo")
                }
            }

            Then("Redis에 인증토큰이 저장된다") {
                verify(exactly = 1) {
                    valueOperations.set(
                        "verifiedToken:$phoneNo",
                        any(),
                        verifiedTokenExpiration,
                        TimeUnit.MINUTES
                    )
                }
            }
        }

        When("인증번호가 일치하지 않으면") {
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verificationCode:$phoneNo") } returns "000000"

            val exception = runCatching {
                authService.confirmVerificationCode(request)
            }.exceptionOrNull()

            Then("예외가 발생한다") {
                exception.shouldBeInstanceOf<NotFoundException>()
                    .errorCode shouldBe ErrorCode.VERIFICATION_CODE_MISMATCH
            }

            Then("Redis에서 인증번호가 삭제되지 않는다") {
                verify(exactly = 0) {
                    stringRedisTemplate.delete(any<String>())
                }
            }

            Then("Redis에 인증토큰이 저장되지 않는다") {
                verify(exactly = 0) {
                    valueOperations.set(
                        "verifiedToken$phoneNo",
                        any(),
                        verifiedTokenExpiration,
                        TimeUnit.MINUTES
                    )
                }
            }
        }

        When("인증번호가 존재하지 않거나 만료되었으면") {
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verificationCode:$phoneNo") } returns null

            val exception = runCatching {
                authService.confirmVerificationCode(request)
            }.exceptionOrNull()

            Then("예외가 발생한다") {
                exception.shouldBeInstanceOf<NotFoundException>()
                    .errorCode shouldBe ErrorCode.VERIFICATION_CODE_NOT_FOUND
            }

            Then("Redis에 인증토큰이 저장되지 않는다") {
                verify(exactly = 0) {
                    valueOperations.set(
                        "verifiedToken$phoneNo",
                        any(),
                        verifiedTokenExpiration,
                        TimeUnit.MINUTES
                    )
                }
            }
        }
    }

    Given("휴대폰 검증 요청이 있을 때") {
        val phoneNo = "01012345678"
        val request = PhoneNoConfirmRequest(phoneNo = phoneNo)

        When("등록된 사용자의 휴대폰 번호이면") {
            val user = mockk<User>()
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns user

            authService.confirmPhoneNo(request)

            Then("정상적으로 검증된다") {
                verify(exactly = 1) {
                    userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo)
                }
            }
        }

        When("등록되어 있지 않은 휴대폰 번호이면") {
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns null

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.confirmPhoneNo(request)
                }.errorCode shouldBe ErrorCode.USER_NOT_FOUND
            }
        }
    }

    Given("회원가입 요청이 있을 때") {
        val phoneNo = "01012345678"
        val verifiedToken = "verifiedToken"
        val request = SignupRequest(phoneNo = phoneNo, verifiedToken = verifiedToken)

        When("회원가입에 성공하면") {
            val userId = UUID.randomUUID()
            val user = mockk<User>() {
                every { id } returns userId
            }
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns verifiedToken
            every { stringRedisTemplate.delete("verifiedToken:$phoneNo") } returns true
            every { userRepository.save(any()) } returns user
            every { jwtTokenProvider.generateAccessToken(userId) } returns "accessToken"
            every { jwtTokenProvider.generateRefreshToken(userId) } returns "refreshToken"
            every { refreshTokenService.saveRefreshToken(userId, "refreshToken") } just Runs
            every { eventPublisher.publishEvent(any<VerifiedTokenDeleteEvent>()) } just Runs

            val response = authService.signup(request)

            Then("데이터베이스에 사용자 데이터가 저장된다") {
                verify(exactly = 1) {
                    userRepository.save(match {
                        it.phoneNo == phoneNo
                    })
                }
            }

            Then("인증토큰 삭제 이벤트가 발행된다") {
                verify(exactly = 1) {
                    eventPublisher.publishEvent(match<VerifiedTokenDeleteEvent> {
                        it.phoneNo == phoneNo
                    })
                }
            }

            Then("RefreshToken 저장 이벤트가 발행된다") {
                verify(exactly = 1) {
                    eventPublisher.publishEvent(match<RefreshTokenSaveEvent> {
                        it.userId == userId && it.refreshToken == "refreshToken"
                    })
                }
            }

            Then("올바른 토큰 정보가 반환된다") {
                response.accessToken shouldBe "accessToken"
                response.refreshToken shouldBe "refreshToken"
            }
        }

        When("인증토큰이 존재하지 않거나 만료되었으면") {
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns null

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.signup(request)
                }.errorCode shouldBe ErrorCode.VERIFIED_TOKEN_NOT_FOUND
            }
        }

        When("인증토큰이 일치하지 않으면") {
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns "abc"

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.signup(request)
                }.errorCode shouldBe ErrorCode.VERIFIED_TOKEN_MISMATCH
            }
        }
    }

    Given("로그인 요청이 있을 때") {
        val phoneNo = "01012345678"
        val verifiedToken = "verifiedToken"
        val request = SigninRequest(phoneNo = phoneNo, verifiedToken = verifiedToken)

        When("로그인에 성공하면") {
            val userId = UUID.randomUUID()
            val user = mockk<User> {
                every { id } returns userId
            }
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns user
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns verifiedToken
            every { jwtTokenProvider.generateAccessToken(userId) } returns "accessToken"
            every { jwtTokenProvider.generateRefreshToken(userId) } returns "refreshToken"
            every { refreshTokenService.saveRefreshToken(userId, "refreshToken") } just Runs
            every { eventPublisher.publishEvent(any<VerifiedTokenDeleteEvent>()) } just Runs

            val response = authService.signin(request)

            Then("인증토큰 삭제 이벤트가 발행된다") {
                verify(exactly = 1) {
                    eventPublisher.publishEvent(match<VerifiedTokenDeleteEvent> {
                        it.phoneNo == phoneNo
                    })
                }
            }

            Then("RefreshToken 저장 이벤트가 발행된다") {
                verify(exactly = 1) {
                    eventPublisher.publishEvent(match<RefreshTokenSaveEvent> {
                        it.userId == userId && it.refreshToken == "refreshToken"
                    })
                }
            }

            Then("올바른 토큰 정보가 반환된다") {
                response.accessToken shouldBe "accessToken"
                response.refreshToken shouldBe "refreshToken"
            }
        }

        When("등록된 사용자가 아니면") {
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns null

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.signin(request)
                }.errorCode shouldBe ErrorCode.USER_NOT_FOUND
            }
        }

        When("인증토큰이 존재하지 않거나 만료되었으면") {
            val userId = UUID.randomUUID()
            val user = mockk<User> {
                every { id } returns userId
            }
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns user
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns null

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.signin(request)
                }.errorCode shouldBe ErrorCode.VERIFIED_TOKEN_NOT_FOUND
            }
        }

        When("인증토큰이 일치하지 않으면") {
            val userId = UUID.randomUUID()
            val user = mockk<User> {
                every { id } returns userId
            }
            every { userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo) } returns user
            every { stringRedisTemplate.opsForValue() } returns valueOperations
            every { valueOperations.get("verifiedToken:$phoneNo") } returns "abc"

            Then("예외가 발생한다") {
                shouldThrow<NotFoundException> {
                    authService.signin(request)
                }.errorCode shouldBe ErrorCode.VERIFIED_TOKEN_MISMATCH
            }
        }
    }
})