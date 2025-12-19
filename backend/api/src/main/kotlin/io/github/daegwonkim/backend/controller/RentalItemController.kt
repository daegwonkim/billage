package io.github.daegwonkim.backend.controller

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
import java.util.UUID

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
        return rentalItemService.getRentalItems(
            category = category,
            keyword = keyword,
            page = page,
            size = size,
            sortBy = sortBy,
            sortDirection = sortDirection
        )
    }

    @Operation(summary = "대여 상품 상세 조회", description = "특정 상품의 상세 정보를 조회합니다")
    @GetMapping("/{id}")
    fun getRentalItem(
        @PathVariable("id") id: UUID
    ): GetRentalItemResponse {
        return rentalItemService.getRentalItem(userId = UUID.randomUUID(), rentalItemId = id)
    }

    @Operation(summary = "비슷한 상품 목록 조회", description = "현재 보고있는 상품과 비슷한 상품 목록을 조회합니다")
    @GetMapping("/{id}/similar")
    fun getSimilarRentalItems(
        @PathVariable("id") id: UUID
    ): GetSimilarRentalItemsResponse {
        return GetSimilarRentalItemsResponse(
            rentalItems = listOf(
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item1/400/300",
                    title = "캠핑 텐트 4인용",
                    pricePerDay = 15000,
                    pricePerWeek = 80000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item2/400/300",
                    title = "소니 A7M4 미러리스 카메라",
                    pricePerDay = 50000,
                    pricePerWeek = 280000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item3/400/300",
                    title = "전동 킥보드 샤오미",
                    pricePerDay = 10000,
                    pricePerWeek = 55000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item4/400/300",
                    title = "빔프로젝터 엡손 EH-TW7100",
                    pricePerDay = 25000,
                    pricePerWeek = 140000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item5/400/300",
                    title = "드론 DJI Mini 3 Pro",
                    pricePerDay = 35000,
                    pricePerWeek = 200000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item6/400/300",
                    title = "닌텐도 스위치 OLED",
                    pricePerDay = 8000,
                    pricePerWeek = 45000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item7/400/300",
                    title = "캠핑 의자 세트 (4개)",
                    pricePerDay = 5000,
                    pricePerWeek = 28000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item8/400/300",
                    title = "고프로 히어로 12",
                    pricePerDay = 20000,
                    pricePerWeek = 110000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item9/400/300",
                    title = "무선 마이크 로데 와이어리스 고",
                    pricePerDay = 12000,
                    pricePerWeek = 65000
                ),
                GetSimilarRentalItemsResponse.RentalItem(
                    id = UUID.randomUUID(),
                    thumbnailImageUrl = "https://picsum.photos/seed/item10/400/300",
                    title = "스탠딩 조명 세트",
                    pricePerDay = 18000,
                    pricePerWeek = 100000
                )
            )
        )
    }

    @Operation(summary = "대여 상품 등록", description = "새로운 대여 상품을 등록합니다")
    @PostMapping
    fun register(
        @RequestBody request: RegisterRentalItemRequest
    ): RegisterRentalItemResponse {
        return rentalItemService.register(userId = UUID.randomUUID(), request = request)
    }

    @Operation(summary = "수정 전 데이터 조회", description = "대여 상품 수정 전 데이터를 조회합니다")
    @GetMapping("/modify/{id}")
    fun getForModify(@PathVariable("id") id: UUID): GetRentalItemForModifyResponse {
        return rentalItemService.getForModify(id)
    }

    @Operation(summary = "상품 정보 수정", description = "기존의 대여 상품 정보를 수정합니다")
    @PutMapping("/{id}")
    fun modify(
        @PathVariable("id") id: UUID,
        @RequestBody modifiedInfo: ModifyRentalItemRequest
    ): ModifyRentalItemResponse {
        return rentalItemService.modify(id = id, modifiedInfo = modifiedInfo)
    }
}