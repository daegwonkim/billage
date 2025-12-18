package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.file.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.exception.ExternalServiceException
import io.github.daegwonkim.backend.exception.data.ErrorCode
import io.github.daegwonkim.backend.logger
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class StorageService(
    private val supabaseStorageClient: SupabaseStorageClient
) {

    /**
     * 업로드용 Signed URL 생성
     */
    fun generateSignedUrl(
        bucket: String,
        originalFileName: String
    ): GenerateSignedUrlResponse {
        val fileKey = generateFileKey(originalFileName)

        try {
            val signedUrl = supabaseStorageClient.createSignedUrl(bucket = bucket, fileKey = fileKey)

            return GenerateSignedUrlResponse(
                fileKey = fileKey,
                signedUrl = signedUrl
            )
        } catch (e: Exception) {
            throw ExternalServiceException(ErrorCode.SIGNED_URL_CREATE_FAILED, e)
        }
    }

    /**
     * 날짜 계층 구조 + UUID로 파일 키 생성
     * 형식: YYYY/MM/UUID.extension
     */
    private fun generateFileKey(originalFileName: String): String {
        val now = LocalDateTime.now()
        val extension = getFileExtension(originalFileName)
        val year = now.year
        val month = now.monthValue.toString().padStart(2, '0')

        return "$year/$month/${UUID.randomUUID()}.$extension"
    }

    /**
     * 파일명에서 확장자 추출
     */
    private fun getFileExtension(fileName: String): String {
        return fileName.substringAfterLast('.', "")
            .lowercase()
            .takeIf { it.isNotEmpty() } ?: "bin"
    }
}