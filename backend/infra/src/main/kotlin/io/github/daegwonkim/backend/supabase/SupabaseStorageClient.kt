package io.github.daegwonkim.backend.supabase

import io.github.daegwonkim.backend.supabase.dto.CreateSignedUrlRequest
import io.github.daegwonkim.backend.supabase.dto.CreateSignedUrlResponse
import io.github.daegwonkim.backend.supabase.dto.CreateUploadSignedUrlResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class SupabaseStorageClient(
    private val supabaseRestClient: RestClient,
    @Value($$"${supabase.url}")
    private val supabaseUrl: String
) {

    /**
     * 업로드용 Signed URL 생성
     * POST /storage/v1/object/upload/sign/{bucket}/{fileKey}?token=true
     */
    fun createUploadSignedUrl(bucket: String, fileKey: String): String {
        val response = supabaseRestClient
            .post()
            .uri("/storage/v1/object/upload/sign/$bucket/$fileKey")
            .retrieve()
            .body(CreateUploadSignedUrlResponse::class.java)
            ?: throw RuntimeException("업로드용 Signed URL 발급에 실패했습니다")

        return "$supabaseUrl/storage/v1${response.url}"
    }

    /**
     * 조회용 Signed URL 생성
     * POST /storage/v1/object/sign/{bucket}/{fileKey}
     */
    fun createSignedUrl(bucket: String, fileKey: String, expiresIn: Int = 3600): String {
        val request = CreateSignedUrlRequest(expiresIn = expiresIn)

        val response = supabaseRestClient
            .post()
            .uri("/storage/v1/object/sign/$bucket/$fileKey")
            .body(request)
            .retrieve()
            .body(CreateSignedUrlResponse::class.java)
            ?: throw RuntimeException("조회용 Signed URL 발급에 실패했습니다")

        return "$supabaseUrl/storage/v1${response.signedURL}"
    }

    /**
     * 파일 삭제
     * DELETE /storage/v1/object/{bucket}/{fileKey}
     */
    fun removeFile(bucket: String, fileKey: String): Boolean {
        return try {
            supabaseRestClient
                .delete()
                .uri("/storage/v1/object/$bucket/$fileKey")
                .retrieve()
                .body(String::class.java)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getPublicUrl(bucket: String, fileKey: String): String {
        return "$supabaseUrl/storage/v1/object/public/$bucket/$fileKey"
    }
}