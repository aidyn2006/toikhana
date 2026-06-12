package com.example.toikhana.repository;

import java.util.List;
import java.util.Optional;

import com.example.toikhana.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByPublishedTrueOrderByPublishedAtDesc();

    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);
}
