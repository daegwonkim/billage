package io.github.daegwonkim.backend.service;

import io.github.daegwonkim.backend.common.exception.ErrorCode;
import io.github.daegwonkim.backend.common.exception.domain.VerificationException;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class VerificationCodeService {

    private final DefaultMessageService messageService;
    private final RedisTemplate<String, String> redisTemplate;
    private final String from;

    private static final long AUTH_CODE_EXPIRATION = 5;
    private static final String KEY_PREFIX = "verificationCode:";

    public VerificationCodeService(
            DefaultMessageService messageService,
            RedisTemplate<String, String> redisTemplate,
            @Value("${coolsms.from}") String from
    ) {
        this.messageService = messageService;
        this.redisTemplate = redisTemplate;
        this.from = from;
    }

    /**
     * coolsms를 활용한 인증번호 전송
     * @param phoneNo 전송할 휴대폰 번호
     */
    public void sendVerificationCode(String phoneNo) {
        try {
            String verificationCode = generateVerificationCode();

            Message message = new Message();
            message.setFrom(from);
            message.setTo(phoneNo);
            message.setText("[빌리지] 인증번호는 [" + verificationCode + "]입니다.\n절대 타인에게 노출하지 마세요.");

            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));

            if (Objects.requireNonNull(response).getStatusCode().equals("2000")) {
                ValueOperations<String, String> ops = redisTemplate.opsForValue();
                ops.set(KEY_PREFIX + phoneNo, verificationCode, AUTH_CODE_EXPIRATION, TimeUnit.MINUTES);
            } else {
                throw new VerificationException(ErrorCode.SMS_SEND_FAILED);
            }
        } catch (Exception e) {
            log.error("인증번호 전송에 실패했습니다: {}", phoneNo, e);
            throw new VerificationException(ErrorCode.VERIFICATION_CODE_SEND_FAILED, e);
        }
    }

    /**
     * 인증번호 검증
     * @param phoneNo 검증할 휴대폰 번호
     * @param verificationCode 사용자가 압력한 인증번호
     */
    public void confirmVerificationCode(String phoneNo, String verificationCode) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String savedCode = ops.get(KEY_PREFIX + phoneNo);

        if (savedCode == null) {
            throw new VerificationException(ErrorCode.VERIFICATION_CODE_NOT_FOUND);
        }

        if (!savedCode.equals(verificationCode)) {
            throw new VerificationException(ErrorCode.VERIFICATION_CODE_MISMATCH);
        }

        redisTemplate.delete(KEY_PREFIX + phoneNo);
    }

    /**
     * 인증번호 생성
     * @return 6자리 인증번호
     */
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(1000000); // 0 ~ 999999
        return String.format("%06d", code); // 6자리로 포맷팅 (앞자리 0 채움)
    }
}
