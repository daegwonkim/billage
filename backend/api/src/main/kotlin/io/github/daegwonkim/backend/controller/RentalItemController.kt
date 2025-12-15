package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.rental_item.RentalItemGetForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.RentalItemRegisterRequest
import io.github.daegwonkim.backend.dto.rental_item.RentalItemRegisterResponse
import io.github.daegwonkim.backend.dto.rental_item.SearchRentalItemsResponse
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
import io.github.daegwonkim.backend.service.RentalItemService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api/rental-items")
class RentalItemController(
    private val rentalItemService: RentalItemService
) {
    @GetMapping("/search")
    @Operation(summary = "대여 상품 목록 조회", description = "조건에 맞는 대여 상품을 모두 조회합니다")
    fun search(
        @RequestParam(required = false) category: RentalItemCategory?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "CREATED_AT") sortBy: RentalItemSortBy,
        @RequestParam(defaultValue = "DESC") sortDirection: SortDirection
    ): SearchRentalItemsResponse {
        return rentalItemService.search(
            category = category,
            keyword = keyword,
            page = page,
            size = size,
            sortBy = sortBy,
            sortDirection = sortDirection
        )
    }

    @PostMapping("/register", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @Operation(summary = "대여 상품 등록", description = "새로운 대여 상품을 등록합니다")
    fun register(
        @AuthenticationPrincipal userId: UUID,
        @RequestPart("rental_item") request: RentalItemRegisterRequest,
        @RequestPart("images") images: List<MultipartFile>
    ): RentalItemRegisterResponse {
        return rentalItemService.register(userId = userId, request = request, images = images)
    }

    @GetMapping("/modify/{id}")
    @Operation(summary = "수정 전 데이터 조회", description = "대여 상품 수정 전 데이터를 조회합니다")
    fun getForModify(@PathVariable("id") id: UUID): RentalItemGetForModifyResponse {
        return rentalItemService.getForModify(id)
    }
}