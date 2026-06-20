package com.example.toikhana.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.toikhana.dto.ImportItem;
import com.example.toikhana.dto.ImportRequest;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.model.ToikhanaPhoto;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaPhotoRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import com.example.toikhana.storage.FileStorageService;
import com.example.toikhana.util.SlugUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Imports organizations parsed from 2GIS into the catalog.
 * Records carrying a {@code source2gisId} that already exists are skipped,
 * so re-running an import is idempotent.
 */
@Service
@Transactional
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final ToikhanaRepository toikhanaRepository;
    private final ToikhanaPhotoRepository photoRepository;
    private final CityRepository cityRepository;
    private final FileStorageService fileStorageService;
    private final CityCountService cityCountService;

    public ImportService(ToikhanaRepository toikhanaRepository,
                         ToikhanaPhotoRepository photoRepository,
                         CityRepository cityRepository,
                         FileStorageService fileStorageService,
                         CityCountService cityCountService) {
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
        this.cityRepository = cityRepository;
        this.fileStorageService = fileStorageService;
        this.cityCountService = cityCountService;
    }

    public Map<String, Object> importFrom2gis(ImportRequest request) {
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new NotFoundException("City not found"));

        int created = 0;
        int skipped = 0;
        int photosDownloaded = 0;

        for (ImportItem item : request.getItems()) {
            if (item.getName() == null || item.getName().trim().isEmpty()) {
                skipped++;
                continue;
            }

            String source2gisId = trimToNull(item.getSource2gisId(), 100);
            if (source2gisId != null && toikhanaRepository.findFirstBySource2gisId(source2gisId).isPresent()) {
                log.info("Skip already imported 2GIS id={}", source2gisId);
                skipped++;
                continue;
            }

            Toikhana toikhana = new Toikhana();
            toikhana.setCityId(city.getId());
            toikhana.setName(truncate(item.getName().trim(), 200));
            toikhana.setSlug(uniqueSlug(item.getName()));
            toikhana.setAddress(truncate(item.getAddress(), 300));
            toikhana.setPhone(truncate(item.getPhone(), 50));
            toikhana.setWhatsapp(truncate(item.getWhatsapp(), 50));
            toikhana.setSource2gisId(source2gisId);
            toikhana.setActive(request.isActive());
            if (item.getRubrics() != null && !item.getRubrics().isEmpty()) {
                toikhana.setDescriptionRu(String.join(", ", item.getRubrics()));
            }
            Toikhana saved = toikhanaRepository.save(toikhana);
            created++;

            photosDownloaded += downloadPhotos(saved.getId(), item.getPhotoUrls());
        }

        cityCountService.refresh();

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("created", created);
        result.put("skipped", skipped);
        result.put("photosDownloaded", photosDownloaded);
        return result;
    }

    private int downloadPhotos(Long toikhanaId, List<String> urls) {
        if (urls == null) {
            return 0;
        }
        int downloaded = 0;
        int sortOrder = 0;
        for (String url : urls) {
            if (url == null || url.trim().isEmpty()) {
                continue;
            }
            try {
                String stored = fileStorageService.storeToikhanaPhotoFromUrl(toikhanaId, url.trim());
                ToikhanaPhoto photo = new ToikhanaPhoto();
                photo.setToikhanaId(toikhanaId);
                photo.setUrl(stored);
                photo.setMain(downloaded == 0);
                photo.setSortOrder(sortOrder++);
                photoRepository.save(photo);
                downloaded++;
            } catch (RuntimeException ex) {
                log.warn("Could not import photo {} for toikhana {}: {}", url, toikhanaId, ex.getMessage());
            }
        }
        return downloaded;
    }

    private String uniqueSlug(String name) {
        String base = SlugUtil.slugify(name);
        if (base.isEmpty()) {
            base = "toikhana";
        }
        String slug = base;
        int suffix = 2;
        while (toikhanaRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + suffix;
            suffix++;
        }
        return slug;
    }

    private static String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.length() > max ? trimmed.substring(0, max) : trimmed;
    }

    private static String trimToNull(String value, int max) {
        return truncate(value, max);
    }
}
