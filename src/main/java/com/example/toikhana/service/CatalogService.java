package com.example.toikhana.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.toikhana.dto.CityDto;
import com.example.toikhana.dto.PhotoDto;
import com.example.toikhana.dto.ToikhanaDetailDto;
import com.example.toikhana.dto.ToikhanaListItemDto;
import com.example.toikhana.dto.ToyTypeDto;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.model.ToikhanaPhoto;
import com.example.toikhana.model.ToyType;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaPhotoRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import com.example.toikhana.repository.ToyTypeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CityRepository cityRepository;
    private final ToikhanaRepository toikhanaRepository;
    private final ToikhanaPhotoRepository photoRepository;
    private final ToyTypeRepository toyTypeRepository;

    public CatalogService(CityRepository cityRepository,
                          ToikhanaRepository toikhanaRepository,
                          ToikhanaPhotoRepository photoRepository,
                          ToyTypeRepository toyTypeRepository) {
        this.cityRepository = cityRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
        this.toyTypeRepository = toyTypeRepository;
    }

    public List<CityDto> getCities() {
        List<CityDto> result = new ArrayList<CityDto>();
        for (City city : cityRepository.findAll(Sort.by("nameRu"))) {
            result.add(toCityDto(city));
        }
        return result;
    }

    public CityDto getCity(String slug) {
        City city = cityRepository.findBySlug(slug)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("City not found");
                    }
                });
        return toCityDto(city);
    }

    public List<ToikhanaListItemDto> getFeaturedToikhanas() {
        List<ToikhanaListItemDto> result = new ArrayList<ToikhanaListItemDto>();
        for (Toikhana toikhana : toikhanaRepository.findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc()) {
            result.add(toListItemDto(toikhana));
            if (result.size() == 6) {
                break;
            }
        }
        return result;
    }

    public List<ToikhanaListItemDto> getToikhanas(String citySlug, Integer capacity, String typeSlug) {
        List<Toikhana> candidates;
        if (citySlug != null && !citySlug.trim().isEmpty()) {
            City city = cityRepository.findBySlug(citySlug)
                    .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                        @Override
                        public NotFoundException get() {
                            return new NotFoundException("City not found");
                        }
                    });
            candidates = toikhanaRepository.findByCityIdAndActiveTrueOrderByFeaturedDescCreatedAtDesc(city.getId());
        } else {
            candidates = toikhanaRepository.findAll(Sort.by(Sort.Order.desc("featured"), Sort.Order.desc("createdAt")));
        }

        List<ToyType> matchedType = null;
        if (typeSlug != null && !typeSlug.trim().isEmpty()) {
            ToyType toyType = toyTypeRepository.findBySlug(typeSlug)
                    .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                        @Override
                        public NotFoundException get() {
                            return new NotFoundException("Toy type not found");
                        }
                    });
            matchedType = new ArrayList<ToyType>();
            matchedType.add(toyType);
        }

        List<ToikhanaListItemDto> result = new ArrayList<ToikhanaListItemDto>();
        for (Toikhana toikhana : candidates) {
            if (!toikhana.isActive()) {
                continue;
            }
            if (capacity != null && !matchesCapacity(toikhana, capacity.intValue())) {
                continue;
            }
            if (matchedType != null && !containsAnyType(toikhana, matchedType)) {
                continue;
            }
            result.add(toListItemDto(toikhana));
        }
        return result;
    }

    public ToikhanaDetailDto getToikhana(String slug) {
        Toikhana toikhana = toikhanaRepository.findBySlug(slug)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Toikhana not found");
                    }
                });
        return toDetailDto(toikhana);
    }

    public List<ToikhanaListItemDto> getSimilarToikhanas(Long cityId, Long exceptId) {
        List<ToikhanaListItemDto> result = new ArrayList<ToikhanaListItemDto>();
        for (Toikhana toikhana : toikhanaRepository.findByCityIdAndActiveTrueOrderByFeaturedDescCreatedAtDesc(cityId)) {
            if (!toikhana.getId().equals(exceptId)) {
                result.add(toListItemDto(toikhana));
            }
        }
        return result;
    }

    public CityDto toCityDto(City city) {
        CityDto dto = new CityDto();
        dto.setId(city.getId());
        dto.setNameKk(city.getNameKk());
        dto.setNameRu(city.getNameRu());
        dto.setSlug(city.getSlug());
        dto.setToikhanaCount(city.getToikhanaCount());
        return dto;
    }

    public ToyTypeDto toToyTypeDto(ToyType toyType) {
        ToyTypeDto dto = new ToyTypeDto();
        dto.setId(toyType.getId());
        dto.setNameKk(toyType.getNameKk());
        dto.setNameRu(toyType.getNameRu());
        dto.setSlug(toyType.getSlug());
        dto.setIcon(toyType.getIcon());
        return dto;
    }

    public PhotoDto toPhotoDto(ToikhanaPhoto photo) {
        PhotoDto dto = new PhotoDto();
        dto.setId(photo.getId());
        dto.setUrl(photo.getUrl());
        dto.setMain(photo.isMain());
        dto.setSortOrder(photo.getSortOrder());
        return dto;
    }

    public ToikhanaListItemDto toListItemDto(Toikhana toikhana) {
        ToikhanaListItemDto dto = new ToikhanaListItemDto();
        dto.setId(toikhana.getId());
        dto.setName(toikhana.getName());
        dto.setSlug(toikhana.getSlug());
        dto.setAddress(toikhana.getAddress());
        dto.setCapacityMin(toikhana.getCapacityMin());
        dto.setCapacityMax(toikhana.getCapacityMax());
        dto.setPriceMin(toikhana.getPriceMin());
        dto.setPriceMax(toikhana.getPriceMax());
        dto.setFeatured(toikhana.isFeatured());
        dto.setToyTypes(toToyTypeDtos(toikhana));
        Optional<ToikhanaPhoto> mainPhoto = photoRepository.findByToikhanaIdOrderByMainDescSortOrderAscIdAsc(toikhana.getId())
                .stream()
                .findFirst();
        dto.setMainPhotoUrl(mainPhoto.map(ToikhanaPhoto::getUrl).orElse(null));
        City city = cityRepository.findById(toikhana.getCityId()).orElse(null);
        dto.setCityName(city != null ? city.getNameRu() : null);
        return dto;
    }

    public ToikhanaDetailDto toDetailDto(Toikhana toikhana) {
        ToikhanaDetailDto dto = new ToikhanaDetailDto();
        copyListItem(dto, toikhana);
        City city = cityRepository.findById(toikhana.getCityId()).orElse(null);
        if (city != null) {
            dto.setCitySlug(city.getSlug());
        }
        dto.setDescriptionKk(toikhana.getDescriptionKk());
        dto.setDescriptionRu(toikhana.getDescriptionRu());
        dto.setPhone(toikhana.getPhone());
        dto.setWhatsapp(toikhana.getWhatsapp());
        dto.setActive(toikhana.isActive());
        List<PhotoDto> photos = new ArrayList<PhotoDto>();
        for (ToikhanaPhoto photo : photoRepository.findByToikhanaIdOrderByMainDescSortOrderAscIdAsc(toikhana.getId())) {
            photos.add(toPhotoDto(photo));
        }
        dto.setPhotos(photos);
        return dto;
    }

    private void copyListItem(ToikhanaListItemDto dto, Toikhana toikhana) {
        dto.setId(toikhana.getId());
        dto.setName(toikhana.getName());
        dto.setSlug(toikhana.getSlug());
        dto.setAddress(toikhana.getAddress());
        dto.setCapacityMin(toikhana.getCapacityMin());
        dto.setCapacityMax(toikhana.getCapacityMax());
        dto.setPriceMin(toikhana.getPriceMin());
        dto.setPriceMax(toikhana.getPriceMax());
        dto.setFeatured(toikhana.isFeatured());
        dto.setToyTypes(toToyTypeDtos(toikhana));
        Optional<ToikhanaPhoto> mainPhoto = photoRepository.findByToikhanaIdOrderByMainDescSortOrderAscIdAsc(toikhana.getId())
                .stream()
                .findFirst();
        dto.setMainPhotoUrl(mainPhoto.map(ToikhanaPhoto::getUrl).orElse(null));
        City city = cityRepository.findById(toikhana.getCityId()).orElse(null);
        dto.setCityName(city != null ? city.getNameRu() : null);
    }

    private List<ToyTypeDto> toToyTypeDtos(Toikhana toikhana) {
        List<ToyTypeDto> result = new ArrayList<ToyTypeDto>();
        for (ToyType toyType : toikhana.getToyTypes()) {
            result.add(toToyTypeDto(toyType));
        }
        return result;
    }

    private boolean matchesCapacity(Toikhana toikhana, int capacity) {
        if (toikhana.getCapacityMin() != null && toikhana.getCapacityMin() > capacity) {
            return false;
        }
        if (toikhana.getCapacityMax() != null && toikhana.getCapacityMax() < capacity) {
            return false;
        }
        return true;
    }

    private boolean containsAnyType(Toikhana toikhana, List<ToyType> toyTypes) {
        for (ToyType toyType : toikhana.getToyTypes()) {
            for (ToyType candidate : toyTypes) {
                if (toyType.getId().equals(candidate.getId())) {
                    return true;
                }
            }
        }
        return false;
    }
}
