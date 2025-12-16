package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.file.GenerateSignedUrlRequest
import io.github.daegwonkim.backend.dto.file.GenerateSignedUrlResponse
import io.github.daegwonkim.backend.service.FileService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/files")
class FileController(
    private val fileService: FileService
) {

    @Operation(
        summary = "Signed URL 발급",
        description = "파일을 스토리지에 업로드하기 위한 Signed URL을 발급합니다."
    )
    @PostMapping("/upload-url")
    fun generateSignedUrl(
        @RequestBody request: GenerateSignedUrlRequest
    ): GenerateSignedUrlResponse {
        return fileService.generateSignedUrl(request.bucket, request.fileName)
    }
}