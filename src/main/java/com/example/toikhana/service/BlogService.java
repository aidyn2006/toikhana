package com.example.toikhana.service;

import java.util.ArrayList;
import java.util.List;

import com.example.toikhana.dto.BlogPostDto;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.BlogPost;
import com.example.toikhana.repository.BlogPostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPostDto> getPosts() {
        List<BlogPostDto> result = new ArrayList<BlogPostDto>();
        for (BlogPost post : blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc()) {
            result.add(toDto(post, false));
        }
        return result;
    }

    public BlogPostDto getPost(String slug) {
        BlogPost post = blogPostRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Blog post not found");
                    }
                });
        return toDto(post, true);
    }

    private BlogPostDto toDto(BlogPost post, boolean withBody) {
        BlogPostDto dto = new BlogPostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setExcerpt(post.getExcerpt());
        dto.setCoverUrl(post.getCoverUrl());
        dto.setPublishedAt(post.getPublishedAt());
        if (withBody) {
            dto.setBody(post.getBody());
        }
        return dto;
    }
}
