package com.example.toikhana.service;

import java.util.List;

import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Recomputes the cached {@code toikhanaCount} on every city from the current set
 * of active toikhanas. Shared by admin CRUD, 2GIS import and initial seeding so
 * the counting logic lives in exactly one place.
 */
@Service
public class CityCountService {

    private final CityRepository cityRepository;
    private final ToikhanaRepository toikhanaRepository;

    public CityCountService(CityRepository cityRepository, ToikhanaRepository toikhanaRepository) {
        this.cityRepository = cityRepository;
        this.toikhanaRepository = toikhanaRepository;
    }

    @Transactional
    public void refresh() {
        List<Toikhana> all = toikhanaRepository.findAll();
        for (City city : cityRepository.findAll()) {
            int count = 0;
            for (Toikhana toikhana : all) {
                if (city.getId().equals(toikhana.getCityId()) && toikhana.isActive()) {
                    count++;
                }
            }
            city.setToikhanaCount(count);
            cityRepository.save(city);
        }
    }
}
