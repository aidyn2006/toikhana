package com.example.toikhana.repository;

import java.util.List;
import java.util.Optional;

import com.example.toikhana.model.Toikhana;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToikhanaRepository extends JpaRepository<Toikhana, Long> {
    Optional<Toikhana> findBySlug(String slug);

    List<Toikhana> findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();

    List<Toikhana> findByCityIdAndActiveTrueOrderByFeaturedDescCreatedAtDesc(Long cityId);
}
