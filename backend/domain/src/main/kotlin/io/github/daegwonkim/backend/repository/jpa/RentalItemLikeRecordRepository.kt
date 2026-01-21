package io.github.daegwonkim.backend.repository.jpa

import io.github.daegwonkim.backend.entity.RentalItemLikeRecord
import org.springframework.data.jpa.repository.JpaRepository

interface RentalItemLikeRecordRepository : JpaRepository<RentalItemLikeRecord, Long> {
    fun deleteByUserIdAndRentalItemId(userId: Long, rentalItemId: Long)
}