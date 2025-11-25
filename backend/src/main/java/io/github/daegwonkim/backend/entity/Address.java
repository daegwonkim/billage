package io.github.daegwonkim.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Entity
@Table(name = "Addresses")
public class Address extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String address;

    @Column(precision = 10, scale = 8, nullable = false)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8, nullable = false)
    private BigDecimal longitude;
}
