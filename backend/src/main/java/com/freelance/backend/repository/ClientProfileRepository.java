package com.freelance.backend.repository;

import com.freelance.backend.model.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Integer> {

    @Query("SELECT c FROM ClientProfile c WHERE c.user.userId = :userId")
    Optional<ClientProfile> findByUserId(@Param("userId") Integer userId);
}