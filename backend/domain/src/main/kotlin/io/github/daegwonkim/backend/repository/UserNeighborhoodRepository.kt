package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.UserNeighborhood
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserNeighborhoodRepository : JpaRepository<UserNeighborhood, UUID> {
}