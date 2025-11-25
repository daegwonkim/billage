package io.github.daegwonkim.backend.repository;

import io.github.daegwonkim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
