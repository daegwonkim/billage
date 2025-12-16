package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.file.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.exception.ExternalServiceException
import io.github.daegwonkim.backend.exception.data.ErrorCode
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class FileService(
    private val supabaseStorageClient: SupabaseStorageClient
) {

    /**
     * 업로드용 Signed URL 생성
     */
    fun generateSignedUrl(
        bucket: String,
        originalFileName: String
    ): GenerateSignedUrlResponse {
        val extension = originalFileName.substringAfterLast(".", "")
        val fileKey = "${UUID.randomUUID()}-$originalFileName${if (extension.isNotEmpty()) ".$extension" else ""}"

        val uploadUrl = supabaseStorageClient.createSignedUrl(bucket = bucket, fileKey = fileKey)
            ?: throw ExternalServiceException(ErrorCode.SIGNED_URL_CREATE_FAILED)
        val publicUrl = supabaseStorageClient.getPublicUrl(bucket = bucket, fileKey = fileKey)

        return GenerateSignedUrlResponse(
            fileKey = fileKey,
            uploadUrl = uploadUrl,
            publicUrl = publicUrl
        )
    }
}