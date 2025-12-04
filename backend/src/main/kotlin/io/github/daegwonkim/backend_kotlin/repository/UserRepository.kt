package io.github.daegwonkim.backend_kotlin.repository

import io.github.daegwonkim.backend_kotlin.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository : JpaRepository<User, UUID> {
    fun findByPhoneNoAndIsWithdrawnFalse(phoneNo: String): User?
}