package io.github.daegwonkim.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name= "phone_no", nullable = false)
    private String phoneNo;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "profile_image_url")
    private String profileImageUrl;
}
