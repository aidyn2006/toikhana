package com.example.toikhana.repository;

import java.util.List;

import com.example.toikhana.model.ToikhanaPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToikhanaPhotoRepository extends JpaRepository<ToikhanaPhoto, Long> {
    List<ToikhanaPhoto> findByToikhanaIdOrderByMainDescSortOrderAscIdAsc(Long toikhanaId);

    void deleteByToikhanaId(Long toikhanaId);
}
