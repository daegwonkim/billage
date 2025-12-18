package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.RentalItemImage
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RentalItemImageRepository : JpaRepository<RentalItemImage, UUID> {
    fun findAllByRentalItemIdOrderBySequence(rentalItemId: UUID): List<RentalItemImage>
    fun deleteAllByKeyIn(keys: List<String>)
}