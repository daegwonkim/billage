package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.RentalItemImage
import org.springframework.data.jpa.repository.JpaRepository

interface RentalItemImageRepository : JpaRepository<RentalItemImage, Long> {
    fun findAllByRentalItemIdOrderBySequence(rentalItemId: Long): List<RentalItemImage>
    fun findAllByRentalItemId(rentalItemId: Long): List<RentalItemImage>
    fun deleteAllByKeyIn(keys: List<String>)
    fun deleteAllByRentalItemId(rentalItemId: Long)
}