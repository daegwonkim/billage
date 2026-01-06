package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.UserNeighborhood
import org.springframework.data.jpa.repository.JpaRepository

interface UserNeighborhoodRepository : JpaRepository<UserNeighborhood, Long> {
}