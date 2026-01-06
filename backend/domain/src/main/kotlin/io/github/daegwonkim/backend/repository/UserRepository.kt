package io.github.daegwonkim.backend.repository

import io.github.daegwonkim.backend.entity.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {
    fun findByPhoneNoAndIsWithdrawnFalse(phoneNo: String): User?
    fun existsByPhoneNoAndIsWithdrawnFalse(phoneNo: String): Boolean
}