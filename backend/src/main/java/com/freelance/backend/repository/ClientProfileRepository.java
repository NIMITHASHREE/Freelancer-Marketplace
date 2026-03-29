package com.freelance.backend.repository;
import com.freelance.backend.model.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Integer> {
    Optional<ClientProfile> findByUserUserId(Integer userId);
}