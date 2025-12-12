package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.RentalItem
import io.github.daegwonkim.backend.enumerate.RentalItemCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface RentalItemRepository : JpaRepository<RentalItem, UUID> {
    @Query("""
        SELECT r FROM RentalItem r
        WHERE (:category IS NULL OR r.category = :category)
            AND (:keyword IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    fun searchRentalItems(
        @Param("category") category: RentalItemCategory?,
        @Param("keyword") keyword: String?,
        pageable: Pageable
    ): Page<RentalItem>
}