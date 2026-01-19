package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemCategoriesResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemSortOptionsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetSimilarRentalItemsResponse
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortOption
import io.github.daegwonkim.backend.service.RentalItemService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping

@RestController
@RequestMapping("/api/rental-items")
class RentalItemController(
    private val rentalItemService: RentalItemService
) {
    @Operation(summary = "대여 상품 카테고리 목록 조회", description = "대여 상품 카테고리 목록을 조회합니다")
    @GetMapping("/categories")
    fun getRentalItemCategories(): GetRentalItemCategoriesResponse =
        rentalItemService.getRentalItemCategories()

    @Operation(summary = "대여 상품 정렬 기준 조회", description = "대여 상품 정렬 기준을 조회합니다")
    @GetMapping("/sort-options")
    fun getRentalItemSortOptions(): GetRentalItemSortOptionsResponse =
        rentalItemService.getRentalItemSortOptions()

    @Operation(summary = "대여 상품 목록 조회", description = "조건에 맞는 대여 상품을 모두 조회합니다")
    @GetMapping
    fun getRentalItems(
        @AuthenticationPrincipal userId: Long?,
        @RequestParam(required = false) category: RentalItemCategory?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "LATEST") sortBy: RentalItemSortOption,
    ): GetRentalItemsResponse {
        val request = GetRentalItemsRequest(userId, category, keyword, page, size, sortBy)
        return rentalItemService.getRentalItems(request)
    }

    @Operation(summary = "대여 상품 상세 조회", description = "특정 상품의 상세 정보를 조회합니다")
    @GetMapping("/{id}")
    fun getRentalItem(
        @AuthenticationPrincipal userId: Long?,
        @PathVariable("id") id: Long
    ): GetRentalItemResponse {
        return rentalItemService.getRentalItem(userId, id)
    }

    @Operation(summary = "비슷한 상품 목록 조회", description = "현재 보고있는 상품과 비슷한 상품 목록을 조회합니다")
    @GetMapping("/{id}/similar")
    fun getSimilarRentalItems(
        @PathVariable("id") id: Long
    ): GetSimilarRentalItemsResponse {
        return rentalItemService.getSimilarRentalItems(id)
    }

    @Operation(summary = "대여 상품 등록", description = "새로운 대여 상품을 등록합니다")
    @PostMapping
    fun register(
        @AuthenticationPrincipal userId: Long,
        @RequestBody request: RegisterRentalItemRequest
    ): RegisterRentalItemResponse {
        return rentalItemService.register(userId, request)
    }

    @Operation(summary = "수정 전 데이터 조회", description = "대여 상품 수정 전 데이터를 조회합니다")
    @GetMapping("/modify/{id}")
    fun getForModify(@PathVariable("id") id: Long): GetRentalItemForModifyResponse {
        return rentalItemService.getForModify(id)
    }

    @Operation(summary = "상품 정보 수정", description = "기존의 대여 상품 정보를 수정합니다")
    @PutMapping("/{id}")
    fun modify(
        @PathVariable("id") id: Long,
        @RequestBody modifiedInfo: ModifyRentalItemRequest
    ): ModifyRentalItemResponse {
        return rentalItemService.modify(id, modifiedInfo)
    }

    @Operation(summary = "상품 삭제", description = "등록한 대여 상품을 삭제합니다")
    @DeleteMapping("/{id}")
    fun remove(
        @PathVariable("id") id: Long
    ) = rentalItemService.remove(id)

    @Operation(summary = "대여 상품 좋아요 등록", description = "대여 상품 좋아요를 등록합니다")
    @PostMapping("/{id}/likes")
    fun like(
        @AuthenticationPrincipal userId: Long,
        @PathVariable("id") id: Long
    ) = rentalItemService.like(id, userId)

    @Operation(summary = "대여 상품 좋아요 해제", description = "대여 상품 좋아요를 해제합니다")
    @DeleteMapping("/{id}/likes")
    fun unlike(
        @AuthenticationPrincipal userId: Long,
        @PathVariable("id") id: Long
    ) = rentalItemService.unlike(id, userId)
}