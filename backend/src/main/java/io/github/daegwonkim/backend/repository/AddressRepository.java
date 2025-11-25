package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
}
