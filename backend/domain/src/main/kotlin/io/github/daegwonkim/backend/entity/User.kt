package io.github.daegwonkim.backend.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "phone_no", nullable = false, unique = true)
    var phoneNo: String,

    @Column(nullable = false)
    var nickname: String,

    @Column(name = "profile_image_key")
    var profileImageKey: String? = null,

    @Column(name = "is_withdrawn", nullable = false)
    var isWithdrawn: Boolean = false
) : BaseEntity()