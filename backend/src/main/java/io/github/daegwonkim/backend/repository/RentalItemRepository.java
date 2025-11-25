package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.RentalItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RentalItemRepository extends JpaRepository<RentalItem, UUID> {
}
