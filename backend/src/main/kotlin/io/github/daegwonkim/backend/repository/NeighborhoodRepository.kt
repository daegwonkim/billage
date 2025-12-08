package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.Neighborhood
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface NeighborhoodRepository : JpaRepository<Neighborhood, UUID> {
    fun findByCode(code: String): Neighborhood?
}