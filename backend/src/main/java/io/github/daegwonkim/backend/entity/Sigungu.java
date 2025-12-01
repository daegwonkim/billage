package io.github.daegwonkim.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "sigungu")
public class Sigungu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "sido_id", columnDefinition = "UUID", nullable = false)
    private UUID sidoId;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;
}
