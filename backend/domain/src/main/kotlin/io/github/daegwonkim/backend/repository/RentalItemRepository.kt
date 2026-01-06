package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.RentalItem
import org.springframework.data.jpa.repository.JpaRepository

interface RentalItemRepository : JpaRepository<RentalItem, Long> {
}