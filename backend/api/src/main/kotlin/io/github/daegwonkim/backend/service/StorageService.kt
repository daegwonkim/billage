package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.storage.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.dto.storage.GenerateUploadSignedUrlResponse
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
    fun generateUploadSignedUrl(
        bucket: String,
        originalFileName: String
    ): GenerateUploadSignedUrlResponse {
        val fileKey = generateFileKey(originalFileName)

        val signedUrl = supabaseStorageClient.createUploadSignedUrl(bucket, fileKey)

        return GenerateUploadSignedUrlResponse(fileKey, signedUrl)
    }

    /**
     * 조회용 Signed URL 생성
     */
    fun generateSignedUrl(
        bucket: String,
        fileKey: String
    ): GenerateSignedUrlResponse {
        val signedUrl = supabaseStorageClient.createSignedUrl(bucket, fileKey)

        return GenerateSignedUrlResponse(signedUrl)
    }

    /**
     * 스토리지 파일 삭제
     */
    fun removeFile(bucket: String, fileKey: String) {
        supabaseStorageClient.removeFile(bucket, fileKey)
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