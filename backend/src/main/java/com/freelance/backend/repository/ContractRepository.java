package com.freelance.backend.repository;

import com.freelance.backend.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ContractRepository extends JpaRepository<Contract, Integer> {}