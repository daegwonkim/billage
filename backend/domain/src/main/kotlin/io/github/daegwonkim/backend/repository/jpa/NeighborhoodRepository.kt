package io.github.daegwonkim.backend.repository.jpa

import io.github.daegwonkim.backend.entity.Neighborhood
import org.springframework.data.jpa.repository.JpaRepository

interface NeighborhoodRepository : JpaRepository<Neighborhood, Long> {
    fun findByCode(code: String): Neighborhood?
}