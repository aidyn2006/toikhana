package com.example.toikhana.repository;

import java.util.Optional;

import com.example.toikhana.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findBySlug(String slug);
}
