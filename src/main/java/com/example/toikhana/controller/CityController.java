package com.example.toikhana.controller;

import java.util.List;

import com.example.toikhana.dto.CityDto;
import com.example.toikhana.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CatalogService catalogService;

    public CityController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CityDto> getCities() {
        return catalogService.getCities();
    }

    @GetMapping("/{slug}")
    public CityDto getCity(@PathVariable String slug) {
        return catalogService.getCity(slug);
    }
}
