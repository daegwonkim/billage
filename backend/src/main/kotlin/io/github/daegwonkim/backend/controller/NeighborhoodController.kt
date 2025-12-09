package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.neighborhood.NeighborhoodFindResponse
import io.github.daegwonkim.backend.service.NeighborhoodService
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
    fun locate(
        @RequestParam latitude: Double,
        @RequestParam longitude: Double
    ): NeighborhoodFindResponse = neighborhoodService.locate(latitude, longitude)
}