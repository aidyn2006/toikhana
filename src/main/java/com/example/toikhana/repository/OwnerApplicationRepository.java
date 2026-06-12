package com.example.toikhana.repository;

import java.util.List;

import com.example.toikhana.model.OwnerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerApplicationRepository extends JpaRepository<OwnerApplication, Long> {
    List<OwnerApplication> findAllByOrderByCreatedAtDesc();
}
