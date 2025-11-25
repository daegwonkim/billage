package io.github.daegwonkim.backend.controller;

import io.github.daegwonkim.backend.dto.rental_item.response.RentalItemsSimilarResponse;
import io.github.daegwonkim.backend.dto.user.UserRentalItemsResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/users")
public class UserController {

    @GetMapping(value = "/{id}/rental-items")
    public UserRentalItemsResponse getUserRentalItems(@RequestParam UUID excludeRentalItemId) {
        List<UserRentalItemsResponse.RentalItem> rentalItems = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            UserRentalItemsResponse.RentalItem rentalItem = UserRentalItemsResponse.RentalItem.builder()
                    .id(UUID.randomUUID())
                    .name("유니클로 경량 패딩 블랙")
                    .thumbnailImageUrl("https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop")
                    .pricePerDay(4000)
                    .pricePerWeek(27000)
                    .build();

            rentalItems.add(rentalItem);
        }

        return new UserRentalItemsResponse(rentalItems);
    }
}
