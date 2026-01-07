package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.rental_item.GetOtherRentalItemsBySellerResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemForModifyResponse
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.ModifyRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemRequest
import io.github.daegwonkim.backend.dto.rental_item.RegisterRentalItemResponse
import io.github.daegwonkim.backend.dto.rental_item.GetRentalItemsResponse
import io.github.daegwonkim.backend.dto.rental_item.GetSimilarRentalItemsResponse
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import io.github.daegwonkim.backend.enumerate.RentalItemSortBy
import io.github.daegwonkim.backend.enumerate.SortDirection
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

@RestController
@RequestMapping("/api/rental-items")
class RentalItemController(
    private val rentalItemService: RentalItemService
) {
    @Operation(summary = "대여 상품 목록 조회", description = "조건에 맞는 대여 상품을 모두 조회합니다")
    @GetMapping
    fun getRentalItems(
        @RequestParam(required = false) category: RentalItemCategory?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(defaultValue = "CREATED_AT") sortBy: RentalItemSortBy,
        @RequestParam(defaultValue = "DESC") sortDirection: SortDirection
    ): GetRentalItemsResponse {
        return rentalItemService.getRentalItems(category, keyword, page, size, sortBy, sortDirection)
    }

    @Operation(summary = "대여 상품 상세 조회", description = "특정 상품의 상세 정보를 조회합니다")
    @GetMapping("/{id}")
    fun getRentalItem(
        @PathVariable("id") id: Long
    ): GetRentalItemResponse {
        return rentalItemService.getRentalItem(1L, id)
    }

    @Operation(summary = "비슷한 상품 목록 조회", description = "현재 보고있는 상품과 비슷한 상품 목록을 조회합니다")
    @GetMapping("/{id}/similar")
    fun getSimilarRentalItems(
        @PathVariable("id") id: Long
    ): GetSimilarRentalItemsResponse {
        return rentalItemService.getSimilarRentalItems(id)
    }

    @Operation(summary = "판매자 상품 목록 조회", description = "현재 보고있는 상품 판매자의 다른 상품 목록을 조회합니다")
    @GetMapping("/{id}/other/{sellerId}")
    fun getOtherRentalItemsBySeller(
        @PathVariable("id") id: Long,
        @PathVariable("sellerId") sellerId: Long
    ): GetOtherRentalItemsBySellerResponse {
        return rentalItemService.getOtherRentalItemsBySeller(id, sellerId)
    }

    @Operation(summary = "대여 상품 등록", description = "새로운 대여 상품을 등록합니다")
    @PostMapping
    fun register(
        @RequestBody request: RegisterRentalItemRequest
    ): RegisterRentalItemResponse {
        return rentalItemService.register(1L, request)
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
}