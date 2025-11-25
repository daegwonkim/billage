package io.github.daegwonkim.backend.controller;

import io.github.daegwonkim.backend.dto.page.PageResponse;
import io.github.daegwonkim.backend.dto.rental_item.response.RentalItemCategoryResponse;
import io.github.daegwonkim.backend.dto.rental_item.response.RentalItemDetailResponse;
import io.github.daegwonkim.backend.dto.rental_item.response.RentalItemsSimilarResponse;
import io.github.daegwonkim.backend.dto.rental_item.response.RentalItemsQueryResponse;
import io.github.daegwonkim.backend.enumerate.entity.RentalItemCategory;
import io.github.daegwonkim.backend.enumerate.page.SortBy;
import io.github.daegwonkim.backend.enumerate.page.SortDirection;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/rental-items")
public class RentalItemController {

    @Operation(
            summary = "대여 상품 카테고리 목록 조회",
            description = "대여 상품 카테고리 목록을 조회합니다."
    )
    @GetMapping("/category")
    public RentalItemCategoryResponse getCategories(HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" +
                request.getServerName() +
                (request.getServerPort() != 80 && request.getServerPort() != 443
                        ? ":" + request.getServerPort()
                        : "");

        List<RentalItemCategoryResponse.RentalItemCategory> categories = List.of(
                new RentalItemCategoryResponse.RentalItemCategory(0, baseUrl + "/icons/popular.png", "인기상품"),
                new RentalItemCategoryResponse.RentalItemCategory(1, baseUrl + "/icons/household.png", "가정용품"),
                new RentalItemCategoryResponse.RentalItemCategory(2, baseUrl + "/icons/travel.png", "여행용품"),
                new RentalItemCategoryResponse.RentalItemCategory(3, baseUrl + "/icons/sports.png", "스포츠/운동"),
                new RentalItemCategoryResponse.RentalItemCategory(4, baseUrl + "/icons/electronics.png", "전자제품"),
                new RentalItemCategoryResponse.RentalItemCategory(5, baseUrl + "/icons/fashion.png", "패션"),
                new RentalItemCategoryResponse.RentalItemCategory(6, baseUrl + "/icons/childcare.png", "육아/교육")
        );

        return new RentalItemCategoryResponse(categories);
    }

    @Operation(
            summary = "대여 상품 목록 조회",
            description = "조건에 따라 대여 상품 목록을 조회합니다."
    )
    @GetMapping
    public PageResponse<RentalItemsQueryResponse> getRentalItems(
            @RequestParam(defaultValue = "POPULAR") RentalItemCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "CREATED_AT") SortBy sortBy,
            @RequestParam(defaultValue = "DESC") SortDirection sortDirection
    ) {
        List<RentalItemsQueryResponse> content = new ArrayList<>();

        for (int i = 0; i < 20; i++) {
            RentalItemsQueryResponse rentalItem = RentalItemsQueryResponse.builder()
                    .id(UUID.randomUUID())
                    .name("안드로이드11 스마트티비 4K 43")
                    .thumbnailImageUrl("https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop")
                    .address("마포구 서교동")
                    .pricePerDay(3000)
                    .pricePerWeek(10000)
                    .likes(15)
                    .chats(3)
                    .rentals(1)
                    .createdAt(LocalDateTime.now())
                    .build();

            content.add(rentalItem);
        }

        return PageResponse.<RentalItemsQueryResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(20)
                .totalPages(2)
                .build();
    }

    @Operation(
            summary = "대여 상품 상세 조회",
            description = "대여 상품의 상세 정보를 조회합니다."
    )
    @GetMapping("/{id}")
    public RentalItemDetailResponse getRentalItem(@PathVariable UUID id) {
        RentalItemDetailResponse.Seller seller = RentalItemDetailResponse.Seller.builder()
                .id(UUID.randomUUID())
                .name("승우아빠")
                .address("영등포구 당산동")
                .profileImageUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop")
                .trustLevel(99)
                .build();

        List<String> imageUrls = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            imageUrls.add("https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop");
        }

        RentalItemDetailResponse response = RentalItemDetailResponse.builder()
                .id(UUID.randomUUID())
                .seller(seller)
                .name("아더에러 트레이스 크로스백")
                .category("패션")
                .description("""
                        아더에러 트레이스 크로스백 쉐어링해요 ㅎㅎ
                        정식 명칭: ADER Trace admore crossbody bag Noir
                    
                        21F/W 싱품으로 사진과 같이 블랙 색상입니다!
                    
                        노트북 때문에 백팩을 자주 메서 올려용
                    
                        가방 특성상 실밥이 나와있는 부분이 있어서 그 부분만 조심해서 사용해주시면 될 것 같습니다 :)
                        """)
                .imageUrls(imageUrls)
                .pricePerDay(3000)
                .pricePerWeek(10000)
                .isLiked(true)
                .likes(16)
                .chats(5)
                .rentals(3)
                .views(233)
                .createdAt(LocalDateTime.now())
                .build();

        return response;
    }

    @Operation(
            summary = "비슷한 대여 상품 목록 조회",
            description = "비슷한 대여 상품 목록을 조회합니다."
    )
    @GetMapping("/{id}/similar")
    public RentalItemsSimilarResponse getSimilarRentalItems() {
        List<RentalItemsSimilarResponse.RentalItem> rentalItems = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            RentalItemsSimilarResponse.RentalItem rentalItem = RentalItemsSimilarResponse.RentalItem.builder()
                    .id(UUID.randomUUID())
                    .name("유니클로 경량 패딩 블랙")
                    .thumbnailImageUrl("https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop")
                    .pricePerDay(4000)
                    .pricePerWeek(27000)
                    .build();

            rentalItems.add(rentalItem);
        }

        return new RentalItemsSimilarResponse(rentalItems);
    }
}
