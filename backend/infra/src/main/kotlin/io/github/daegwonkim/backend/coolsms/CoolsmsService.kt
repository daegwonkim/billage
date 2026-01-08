package io.github.daegwonkim.backend.coolsms

import io.github.daegwonkim.backend.exception.infra.ExternalApiException
import io.github.daegwonkim.backend.log.logger
import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.response.SingleMessageSentResponse
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class CoolsmsService(
    private val messageService: DefaultMessageService,
    @Value($$"${coolsms.from}")
    private val smsFrom: String
) {
    companion object {
        private const val SUCCESS_CODE = "2000"
    }

    fun sendSms(to: String, text: String): SendSmsResponse {
        val message = createMessage(to, text)

        try {
            val response = requestSendOne(message)
            return SendSmsResponse(response.statusCode, response.statusMessage)
        } catch (e: ExternalApiException) {
            throw e
        } catch (e: Exception) {
            logger.error(e) { "CoolSMS API 호출 중 예외 발생: phoneNo=****${to.takeLast(4)}" }
            throw ExternalApiException(apiName = "CoolSMS", cause = e)
        }
    }

    private fun createMessage(to: String, text: String) =
        Message().apply {
            from = smsFrom
            this.to = to
            this.text = text
        }

    private fun requestSendOne(message: Message): SingleMessageSentResponse {
        val response = messageService.sendOne(SingleMessageSendingRequest(message))
            ?: throw ExternalApiException(apiName = "CoolSMS")

        if (response.statusCode != SUCCESS_CODE) {
            throw ExternalApiException(
                apiName = "CoolSMS",
                statusCode = response.statusCode.toIntOrNull()
            )
        }

        return response
    }
}