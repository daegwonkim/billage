package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository : JpaRepository<User, UUID> {
    fun findByPhoneNoAndIsWithdrawnFalse(phoneNo: String): User?
    fun existsByPhoneNoAndIsWithdrawnFalse(phoneNo: String): Boolean
}