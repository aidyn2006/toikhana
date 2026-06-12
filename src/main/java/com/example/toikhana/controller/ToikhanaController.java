package com.example.toikhana.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.toikhana.dto.ToikhanaDetailDto;
import com.example.toikhana.dto.ToikhanaListItemDto;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/toikhanas")
public class ToikhanaController {

    private final CatalogService catalogService;
    private final CityRepository cityRepository;

    public ToikhanaController(CatalogService catalogService, CityRepository cityRepository) {
        this.catalogService = catalogService;
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String city,
                                    @RequestParam(required = false) String type,
                                    @RequestParam(required = false) Integer capacity) {
        List<ToikhanaListItemDto> items = catalogService.getToikhanas(city, capacity, type);
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("items", items);
        result.put("count", items.size());
        return result;
    }

    @GetMapping("/featured")
    public List<ToikhanaListItemDto> featured() {
        return catalogService.getFeaturedToikhanas();
    }

    @GetMapping("/{slug}")
    public ToikhanaDetailDto getBySlug(@PathVariable String slug) {
        return catalogService.getToikhana(slug);
    }

    @GetMapping("/{slug}/similar")
    public List<ToikhanaListItemDto> similar(@PathVariable String slug) {
        ToikhanaDetailDto detail = catalogService.getToikhana(slug);
        Long cityId = cityRepository.findBySlug(detail.getCitySlug()).get().getId();
        return catalogService.getSimilarToikhanas(cityId, detail.getId());
    }
}
