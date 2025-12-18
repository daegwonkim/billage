package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.storage.GenerateSignedUrlRequest
import io.github.daegwonkim.backend.dto.storage.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.dto.storage.GenerateUploadSignedUrlRequest
import io.github.daegwonkim.backend.dto.storage.GenerateUploadSignedUrlResponse
import io.github.daegwonkim.backend.dto.storage.StorageFileRemoveRequest
import io.github.daegwonkim.backend.service.StorageService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/storage")
class StorageController(
    private val storageService: StorageService
) {

    @Operation(
        summary = "업로드용 Signed URL 발급",
        description = "파일을 스토리지에 업로드하기 위한 Signed URL을 발급합니다"
    )
    @PostMapping("/upload/signed-url")
    fun generateUploadSignedUrl(
        @RequestBody request: GenerateUploadSignedUrlRequest
    ): GenerateUploadSignedUrlResponse {
        return storageService.generateUploadSignedUrl(
            bucket = request.bucket,
            originalFileName = request.fileName
        )
    }

    @Operation(
        summary = "조회용 Signed URL 발급",
        description = "파일에 접근 위한 Signed URL을 발급합니다"
    )
    @PostMapping("/signed-url")
    fun generateSignedUrl(
        @RequestBody request: GenerateSignedUrlRequest
    ): GenerateSignedUrlResponse {
        return storageService.generateSignedUrl(
            bucket = request.bucket,
            fileKey = request.fileKey
        )
    }

    @Operation(summary = "스토리지 파일 삭제", description = "스토리지에 저장된 파일을 삭제합니다")
    @DeleteMapping("/file")
    fun removeFile(@RequestBody request: StorageFileRemoveRequest) {
        storageService.removeFile(
            bucket = request.bucket,
            fileKey = request.fileKey
        )
    }
}