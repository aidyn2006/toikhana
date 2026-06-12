package com.example.toikhana.repository;

import java.util.Optional;

import com.example.toikhana.model.ToyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToyTypeRepository extends JpaRepository<ToyType, Long> {
    Optional<ToyType> findBySlug(String slug);
}
