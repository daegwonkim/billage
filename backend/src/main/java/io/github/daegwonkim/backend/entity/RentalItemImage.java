package io.github.daegwonkim.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "rental_item_images")
public class RentalItemImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "rental_item_id", columnDefinition = "UUID", nullable = false)
    private UUID rentalItemId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
