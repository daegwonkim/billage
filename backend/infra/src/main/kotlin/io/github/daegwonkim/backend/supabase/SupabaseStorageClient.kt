package io.github.daegwonkim.backend.supabase

import io.github.daegwonkim.backend.exception.infra.ExternalApiException
import io.github.daegwonkim.backend.log.logger
import io.github.daegwonkim.backend.supabase.dto.CreateSignedUrlRequest
import io.github.daegwonkim.backend.supabase.dto.CreateSignedUrlResponse
import io.github.daegwonkim.backend.supabase.dto.CreateUploadSignedUrlResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatusCode
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
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
        val uri = "/storage/v1/object/upload/sign/$bucket/$fileKey"

        try {
            val response = supabaseRestClient
                .post()
                .uri(uri)
                .retrieve()
                .onStatus(HttpStatusCode::isError) { _, response ->
                    throw ExternalApiException(
                        ExternalApiException.ExternalApi.AMAZON_S3,
                        uri,
                        response.statusCode.value(),
                        response.body.bufferedReader().use { it.readText() }
                    )
                }
                .body(CreateUploadSignedUrlResponse::class.java)
                ?: throw ExternalApiException(ExternalApiException.ExternalApi.AMAZON_S3, uri)

            return "$supabaseUrl/storage/v1${response.url}"
        } catch (e: ExternalApiException) {
            throw e
        } catch (e: Exception) {
            throw ExternalApiException(ExternalApiException.ExternalApi.AMAZON_S3, uri, cause = e)
        }
    }

    /**
     * 조회용 Signed URL 생성
     * POST /storage/v1/object/sign/{bucket}/{fileKey}
     */
    fun createSignedUrl(bucket: String, fileKey: String, expiresIn: Int = 3600): String {
        val uri = "/storage/v1/object/sign/$bucket/$fileKey"
        val request = CreateSignedUrlRequest(expiresIn)

        try {
            val response = supabaseRestClient
                .post()
                .uri(uri)
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError) { _, response ->
                    throw ExternalApiException(
                        ExternalApiException.ExternalApi.AMAZON_S3,
                        uri,
                        response.statusCode.value(),
                        response.body.bufferedReader().use { it.readText() }
                    )
                }
                .body(CreateSignedUrlResponse::class.java)
                ?: throw ExternalApiException(ExternalApiException.ExternalApi.AMAZON_S3, uri)

            return "$supabaseUrl/storage/v1${response.signedURL}"
        } catch (e: ExternalApiException) {
            throw e
        } catch (e: Exception) {
            throw ExternalApiException(ExternalApiException.ExternalApi.AMAZON_S3, uri, cause = e)
        }
    }

    /**
     * 파일 삭제
     * DELETE /storage/v1/object/{bucket}/{fileKey}
     * 삭제 실패 시 로깅만 하고 조용히 실패, 404는 성공으로 처리
     */
    fun removeFile(bucket: String, fileKey: String) {
        val uri = "/storage/v1/object/$bucket/$fileKey"

        runCatching {
            supabaseRestClient
                .delete()
                .uri(uri)
                .retrieve()
                .onStatus(HttpStatusCode::isError) { _, response ->
                    throw ExternalApiException(
                        ExternalApiException.ExternalApi.AMAZON_S3,
                        uri,
                        response.statusCode.value(),
                        response.body.bufferedReader().use { it.readText() }
                    )
                }
                .toBodilessEntity()
        }.onFailure { e ->
            val isNotFound = e is HttpClientErrorException.NotFound
            if (!isNotFound) {
                logger.warn(e) { "S3 파일 삭제 실패 (무시됨): bucket=$bucket, fileKey=$fileKey" }
            }
        }
    }

    fun getPublicUrl(bucket: String, fileKey: String): String {
        return "$supabaseUrl/storage/v1/object/public/$bucket/$fileKey"
    }
}