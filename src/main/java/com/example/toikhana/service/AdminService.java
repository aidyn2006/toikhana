package com.example.toikhana.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.toikhana.dto.AdminToikhanaRequest;
import com.example.toikhana.dto.PhotoDto;
import com.example.toikhana.dto.ToikhanaListItemDto;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.model.ToikhanaPhoto;
import com.example.toikhana.model.ToyType;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaPhotoRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import com.example.toikhana.repository.ToyTypeRepository;
import com.example.toikhana.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class AdminService {

    private final ToikhanaRepository toikhanaRepository;
    private final ToikhanaPhotoRepository photoRepository;
    private final CityRepository cityRepository;
    private final ToyTypeRepository toyTypeRepository;
    private final CatalogService catalogService;
    private final FileStorageService fileStorageService;

    public AdminService(ToikhanaRepository toikhanaRepository,
                        ToikhanaPhotoRepository photoRepository,
                        CityRepository cityRepository,
                        ToyTypeRepository toyTypeRepository,
                        CatalogService catalogService,
                        FileStorageService fileStorageService) {
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
        this.cityRepository = cityRepository;
        this.toyTypeRepository = toyTypeRepository;
        this.catalogService = catalogService;
        this.fileStorageService = fileStorageService;
    }

    public List<Toikhana> list() {
        return toikhanaRepository.findAll();
    }

    /**
     * Lists toikhanas as DTOs. The mapping (which touches the lazy {@code toyTypes}
     * collection) runs inside this transactional method so the entities stay managed;
     * mapping in the controller instead triggered LazyInitializationException.
     */
    public List<ToikhanaListItemDto> listDtos() {
        List<ToikhanaListItemDto> result = new ArrayList<ToikhanaListItemDto>();
        for (Toikhana toikhana : toikhanaRepository.findAll()) {
            result.add(catalogService.toListItemDto(toikhana));
        }
        return result;
    }

    public Toikhana save(AdminToikhanaRequest request) {
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("City not found");
                    }
                });
        Toikhana toikhana = new Toikhana();
        toikhana.setCityId(city.getId());
        apply(request, toikhana);
        Toikhana saved = toikhanaRepository.save(toikhana);
        replaceToyTypes(saved, request.getToyTypeIds());
        refreshCityCounts();
        return saved;
    }

    public Toikhana update(Long id, AdminToikhanaRequest request) {
        Toikhana toikhana = toikhanaRepository.findById(id)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Toikhana not found");
                    }
                });
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("City not found");
                    }
                });
        toikhana.setCityId(city.getId());
        apply(request, toikhana);
        Toikhana saved = toikhanaRepository.save(toikhana);
        replaceToyTypes(saved, request.getToyTypeIds());
        refreshCityCounts();
        return saved;
    }

    public void delete(Long id) {
        Toikhana toikhana = toikhanaRepository.findById(id)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Toikhana not found");
                    }
                });
        toikhana.getToyTypes().clear();
        toikhanaRepository.save(toikhana);
        photoRepository.deleteByToikhanaId(id);
        toikhanaRepository.deleteById(id);
        refreshCityCounts();
    }

    public PhotoDto addPhoto(Long id, MultipartFile file, boolean isMain, Integer sortOrder) {
        Toikhana toikhana = toikhanaRepository.findById(id)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Toikhana not found");
                    }
                });
        if (isMain) {
            List<ToikhanaPhoto> existing = photoRepository.findByToikhanaIdOrderByMainDescSortOrderAscIdAsc(id);
            for (ToikhanaPhoto photo : existing) {
                photo.setMain(false);
                photoRepository.save(photo);
            }
        }
        ToikhanaPhoto photo = new ToikhanaPhoto();
        photo.setToikhanaId(toikhana.getId());
        photo.setUrl(fileStorageService.storeToikhanaPhoto(id, file));
        photo.setMain(isMain);
        photo.setSortOrder(sortOrder != null ? sortOrder : 0);
        ToikhanaPhoto saved = photoRepository.save(photo);
        return catalogService.toPhotoDto(saved);
    }

    private void apply(AdminToikhanaRequest request, Toikhana toikhana) {
        toikhana.setName(request.getName().trim());
        toikhana.setSlug(request.getSlug().trim());
        toikhana.setDescriptionKk(request.getDescriptionKk());
        toikhana.setDescriptionRu(request.getDescriptionRu());
        toikhana.setAddress(request.getAddress());
        toikhana.setPhone(request.getPhone());
        toikhana.setWhatsapp(request.getWhatsapp());
        toikhana.setCapacityMin(request.getCapacityMin());
        toikhana.setCapacityMax(request.getCapacityMax());
        toikhana.setPriceMin(request.getPriceMin());
        toikhana.setPriceMax(request.getPriceMax());
        toikhana.setActive(request.isActive());
        toikhana.setFeatured(request.isFeatured());
    }

    private void replaceToyTypes(Toikhana toikhana, List<Long> toyTypeIds) {
        Set<ToyType> toyTypes = new HashSet<ToyType>();
        if (toyTypeIds != null) {
            for (Long toyTypeId : toyTypeIds) {
                ToyType toyType = toyTypeRepository.findById(toyTypeId)
                        .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                            @Override
                            public NotFoundException get() {
                                return new NotFoundException("Toy type not found");
                            }
                        });
                toyTypes.add(toyType);
            }
        }
        toikhana.setToyTypes(toyTypes);
        toikhanaRepository.save(toikhana);
    }

    private void refreshCityCounts() {
        for (City city : cityRepository.findAll()) {
            int count = 0;
            for (Toikhana toikhana : toikhanaRepository.findAll()) {
                if (city.getId().equals(toikhana.getCityId()) && toikhana.isActive()) {
                    count++;
                }
            }
            city.setToikhanaCount(count);
            cityRepository.save(city);
        }
    }
}
