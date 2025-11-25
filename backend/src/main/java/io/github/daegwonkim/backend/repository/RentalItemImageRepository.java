package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.RentalItemImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RentalItemImageRepository extends JpaRepository<RentalItemImage, UUID> {
}
