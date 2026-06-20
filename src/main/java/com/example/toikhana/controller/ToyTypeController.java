package com.example.toikhana.controller;

import java.util.List;

import com.example.toikhana.dto.ToyTypeDto;
import com.example.toikhana.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/toy-types")
public class ToyTypeController {

    private final CatalogService catalogService;

    public ToyTypeController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<ToyTypeDto> getToyTypes() {
        return catalogService.getToyTypes();
    }
}
