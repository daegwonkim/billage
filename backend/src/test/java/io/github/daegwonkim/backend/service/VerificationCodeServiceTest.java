package io.github.daegwonkim.backend.service;

import io.github.daegwonkim.backend.common.exception.ErrorCode;
import io.github.daegwonkim.backend.common.exception.domain.VerificationException;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class) // Mockito의 @Mock, @InjectMocks 등을 사용하기 위한 설정
@DisplayName("VerificationCodeService 테스트")
class VerificationCodeServiceTest {

    /*
    @Mock: 실제 객체가 아닌 가짜 객체 선언
    - 실제 동작은 하지 않고, 우리가 원하는 대로 동작하도록 설정할 수 있음
    - 외부 의존성(SMS API, Redis 등)을 실제로 호출하지 않고 테스트 가능
    - Mock 없이 테스트하면 실제 비용이 발생하고, 네트워크 문제로 테스트 실패 가능
     */
    @Mock
    private DefaultMessageService messageService;
    @Mock
    private RedisTemplate<String, String> redisTemplate;
    @Mock
    private ValueOperations<String, String> valueOperations;

    // @InjectMocks: VerificationCodeService를 생성하면서 위에서 선언한 @Mock 객체들을 자동으로 주입
    @InjectMocks
    private VerificationCodeService verificationCodeService;

    private static final String TEST_PHONE = "01012345678";
    private static final String TEST_CODE = "123456";
    private static final String KEY_PREFIX = "verificationCode:";

    @BeforeEach
    void setUp() {
        // ReflectionTestUtils로 private final 필드 주입
        ReflectionTestUtils.setField(verificationCodeService, "from", "01000000000");
    }

    @Test
    @DisplayName("인증번호 전송 성공")
    void sendVerificationCode_Success() {
        // given (준비 단계)

        // redisTemplate.opsForValue()가 호출되면 valueOperations(Mock 객체)를 반환
        given(redisTemplate.opsForValue()).willReturn(valueOperations);

        SingleMessageSentResponse response = mock(SingleMessageSentResponse.class);
        given(response.getStatusCode()).willReturn("2000");
        given(messageService.sendOne(any(SingleMessageSendingRequest.class)))
                .willReturn(response);

        // when (실행 단계)
        // 내부에서 messageService.sendOne()이 호출되면 위에서 설정한 Mock이 동작
        verificationCodeService.sendVerificationCode(TEST_PHONE);

        // then (검증 단계)

        // messageService.sendOne()이 정확히 1번 호출되었는가?
        then(messageService).should(times(1))
                .sendOne(any(SingleMessageSendingRequest.class));

        /*
        - valueOperations.set()이 올바른 파라미터로 정확히 1번 호출되었는가?
        - eq(KEY_PREFIX + TEST_PHONE): 첫 번째 파라미터가 정확히 이 값
        - anyString(): 두 번째 파라미터는 어떤 문자열이든 OK
        - eq(5L): 세 번째 파라미터가 정확히 5L
        - eq(TimeUnit.MINUTES): 네 번째 파라미터가 정확히 TimeUnit.MINUTES
         */
        then(valueOperations).should(times(1))
                .set(eq(KEY_PREFIX + TEST_PHONE), anyString(), eq(5L), eq(TimeUnit.MINUTES));
    }

    @Test
    @DisplayName("SMS 전송 실패 시 예외 발생")
    void sendVerificationCode_SmsFailure() {
        // given
        SingleMessageSentResponse response = mock(SingleMessageSentResponse.class);
        given(response.getStatusCode()).willReturn("1010");
        given(messageService.sendOne(any(SingleMessageSendingRequest.class)))
                .willReturn(response);

        // when & then
        assertThatThrownBy(() -> verificationCodeService.sendVerificationCode(TEST_PHONE))
                .isInstanceOf(VerificationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.VERIFICATION_CODE_SEND_FAILED);

        then(valueOperations).should(never())
                .set(anyString(), anyString(), anyLong(), any(TimeUnit.class));
    }

    @Test
    @DisplayName("인증번호 검증 성공")
    void confirmVerificationCode_Success() {
        // given
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get(KEY_PREFIX + TEST_PHONE)).willReturn(TEST_CODE);

        // when
        verificationCodeService.confirmVerificationCode(TEST_PHONE, TEST_CODE);

        // then
        then(valueOperations).should(times(1)).get(KEY_PREFIX + TEST_PHONE);
        then(redisTemplate).should(times(1)).delete(KEY_PREFIX + TEST_PHONE);
    }

    @Test
    @DisplayName("인증번호가 존재하지 않을 때 예외 발생")
    void confirmVerificationCode_NotFound() {
        // given
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get(KEY_PREFIX + TEST_PHONE)).willReturn(null);

        // when & then
        assertThatThrownBy(() -> verificationCodeService.confirmVerificationCode(TEST_PHONE, TEST_CODE))
                .isInstanceOf(VerificationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.VERIFICATION_CODE_NOT_FOUND);

        then(redisTemplate).should(never()).delete(anyString());
    }

    @Test
    @DisplayName("인증번호가 일치하지 않을 때 예외 발생")
    void confirmVerificationCode_Mismatch() {
        // given
        given(redisTemplate.opsForValue()).willReturn(valueOperations);
        given(valueOperations.get(KEY_PREFIX + TEST_PHONE)).willReturn("000000");

        // when & then
        assertThatThrownBy(() -> verificationCodeService.confirmVerificationCode(TEST_PHONE, TEST_CODE))
                .isInstanceOf(VerificationException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.VERIFICATION_CODE_MISMATCH);

        then(redisTemplate).should(never()).delete(anyString());
    }
}
