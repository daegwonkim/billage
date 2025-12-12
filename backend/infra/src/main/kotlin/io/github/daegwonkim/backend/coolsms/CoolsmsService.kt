package io.github.daegwonkim.backend.coolsms

import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class CoolsmsService(
    private val messageService: DefaultMessageService,
    @Value($$"${coolsms.from}")
    private val smsFrom: String
) {
    fun sendSms(phoneNo: String, message: String): SendSmsResponse {
        val message = Message().apply {
            from = smsFrom
            to = phoneNo
            text = message
        }

        val response = messageService.sendOne(parameter = SingleMessageSendingRequest(message))
        return SendSmsResponse(response?.statusCode, response?.statusMessage)
    }
}