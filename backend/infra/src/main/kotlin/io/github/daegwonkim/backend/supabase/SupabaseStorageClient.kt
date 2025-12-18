package io.github.daegwonkim.backend.supabase

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
     * Public URL 생성
     */
    fun getPublicUrl(bucket: String, fileKey: String): String {
        return "$supabaseUrl/storage/v1/object/public/$bucket/$fileKey"
    }

    /**
     * 파일 삭제
     * DELETE /storage/v1/object/{bucket}/{fileKey}
     */
    fun deleteFile(bucket: String, fileKey: String): Boolean {
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
}