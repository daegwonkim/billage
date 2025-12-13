package io.github.daegwonkim.backend.supabase

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class SupabaseStorageService(
    @Value($$"${supabase.url}")
    private val supabaseUrl: String,
    @Value($$"${supabase.api-key}")
    private val supabaseApiKey: String,
) {
    private val restClient: RestClient = RestClient.builder()
        .baseUrl(supabaseUrl)
        .defaultHeader("apiKey", supabaseApiKey)
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer $supabaseApiKey")
        .build()

    fun getPublicUrl(filePath: String): String {
        return "$supabaseUrl/storage/v1/object/public/$filePath"
    }

    fun uploadFile(file: MultipartFile, bucket: String): String {
        val fileName = "${UUID.randomUUID()}-${file.originalFilename}"
        val filePath = "$bucket/$fileName"

        restClient.post()
            .uri("/storage/v1/object/$filePath")
            .contentType(MediaType.parseMediaType(file.contentType ?: "application/octet-stream"))
            .body(file.bytes)
            .retrieve()
            .body(String::class.java)

        return filePath
    }

    fun uploadFiles(files: List<MultipartFile>, bucket: String): List<String> {
        return files.map { file ->
            uploadFile(file, bucket)
        }
    }
}