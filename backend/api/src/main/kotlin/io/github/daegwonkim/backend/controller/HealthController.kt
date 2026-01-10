package io.github.daegwonkim.backend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController {

    @GetMapping("/")
    fun root() = "OK"

    @GetMapping("/health")
    fun health() = mapOf("status" to "UP")
}