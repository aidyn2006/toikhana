package com.example.toikhana.controller;

import java.util.List;

import com.example.toikhana.dto.BlogPostDto;
import com.example.toikhana.service.BlogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogPostDto> list() {
        return blogService.getPosts();
    }

    @GetMapping("/{slug}")
    public BlogPostDto getBySlug(@PathVariable String slug) {
        return blogService.getPost(slug);
    }
}
