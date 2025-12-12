package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.neighborhood.LocateNeighborhoodResponse
import io.github.daegwonkim.backend.dto.neighborhood.NearbyNeighborhoodsResponse
import io.github.daegwonkim.backend.service.NeighborhoodService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/neighborhoods")
class NeighborhoodController(
    private val neighborhoodService: NeighborhoodService
) {
    @GetMapping("/locate")
    @Operation(summary = "동네 찾기", description = "사용자의 현재 위치를 기준으로 동네를 특정합니다")
    fun locate(
        @RequestParam latitude: Double,
        @RequestParam longitude: Double
    ): LocateNeighborhoodResponse = neighborhoodService.locate(latitude, longitude)

    @GetMapping("/nearby")
    @Operation(summary = "근처 동네 조회", description = "사용자의 현재 위치를 기준으로 근처 동네를 조회합니다")
    fun nearby(
        @RequestParam latitude: Double,
        @RequestParam longitude: Double
    ): NearbyNeighborhoodsResponse = neighborhoodService.nearby(latitude, longitude)
}