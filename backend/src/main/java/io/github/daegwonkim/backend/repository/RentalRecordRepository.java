package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.RentalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RentalRecordRepository extends JpaRepository<RentalRecord, UUID> {
}
