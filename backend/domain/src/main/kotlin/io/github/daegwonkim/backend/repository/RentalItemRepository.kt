package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.RentalItem
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RentalItemRepository : JpaRepository<RentalItem, UUID> {
}