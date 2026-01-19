package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.storage.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.dto.storage.GenerateUploadSignedUrlResponse
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.ZoneId
import java.util.UUID

@Service
class StorageService(
    private val supabaseStorageClient: SupabaseStorageClient
) {

    fun generateUploadSignedUrl(
        bucket: String,
        originalFileName: String
    ): GenerateUploadSignedUrlResponse {
        val fileKey = generateFileKey(originalFileName)

        val signedUrl = supabaseStorageClient.createUploadSignedUrl(bucket, fileKey)

        return GenerateUploadSignedUrlResponse(fileKey, signedUrl)
    }

    fun generateSignedUrl(
        bucket: String,
        fileKey: String
    ): GenerateSignedUrlResponse {
        val signedUrl = supabaseStorageClient.createSignedUrl(bucket, fileKey)

        return GenerateSignedUrlResponse(signedUrl)
    }

    fun removeFile(bucket: String, fileKey: String) {
        supabaseStorageClient.removeFile(bucket, fileKey)
    }

    /**
     * 날짜 계층 구조 + UUID로 파일 키 생성
     * 형식: YYYY/MM/UUID.extension
     */
    private fun generateFileKey(originalFileName: String): String {
        val extension = getFileExtension(originalFileName)
        val now = Instant.now()
        val zoned = now.atZone(ZoneId.of("Asia/Seoul"))
        val year = zoned.year
        val month = zoned.monthValue.toString().padStart(2, '0')

        return "$year/$month/${UUID.randomUUID()}.$extension"
    }

    private fun getFileExtension(fileName: String): String {
        return fileName.substringAfterLast('.', "")
            .lowercase()
            .takeIf { it.isNotEmpty() } ?: "bin"
    }
}