package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.RentalItemLikeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RentalItemLikeRecordRepository extends JpaRepository<RentalItemLikeRecord, UUID> {
}
