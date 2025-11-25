package io.github.daegwonkim.backend.entity;

import io.github.daegwonkim.backend.enumerate.entity.RentalItemCategory;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "rental_items")
public class RentalItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalItemCategory category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "price_per_day")
    private Integer pricePerDay;

    @Column(name = "price_per_week")
    private Integer pricePerWeek;
}
