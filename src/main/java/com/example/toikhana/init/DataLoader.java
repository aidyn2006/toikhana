package com.example.toikhana.init;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.model.ToikhanaPhoto;
import com.example.toikhana.model.ToyType;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaPhotoRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import com.example.toikhana.repository.ToyTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataLoader implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final ToyTypeRepository toyTypeRepository;
    private final ToikhanaRepository toikhanaRepository;
    private final ToikhanaPhotoRepository photoRepository;

    public DataLoader(CityRepository cityRepository,
                      ToyTypeRepository toyTypeRepository,
                      ToikhanaRepository toikhanaRepository,
                      ToikhanaPhotoRepository photoRepository) {
        this.cityRepository = cityRepository;
        this.toyTypeRepository = toyTypeRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (cityRepository.count() > 0 || toikhanaRepository.count() > 0) {
            return;
        }

        City astana = city("Астана", "Астана", "astana");
        City almaty = city("Алматы", "Алматы", "almaty");
        City shymkent = city("Шымкент", "Шымкент", "shymkent");
        List<City> cities = cityRepository.saveAll(Arrays.asList(astana, almaty, shymkent));
        astana = cities.get(0);
        almaty = cities.get(1);
        shymkent = cities.get(2);

        ToyType wedding = toyType("Үйлену тойы", "Свадьба", "svadba", "rings");
        ToyType khatyn = toyType("Құдалық", "Сватовство", "kudalyk", "people");
        ToyType birthday = toyType("Туған күн", "День рождения", "birthday", "cake");
        ToyType corporate = toyType("Корпоратив", "Корпоратив", "corporate", "briefcase");
        toyTypeRepository.saveAll(Arrays.asList(wedding, khatyn, birthday, corporate));

        createToikhana(astana, "Aq Orda Hall", "aq-orda-hall", 80, 300, 120000, 450000,
                true, true, wedding, khatyn);
        createToikhana(astana, "Royal Garden", "royal-garden", 60, 220, 90000, 320000,
                true, true, wedding, birthday);
        createToikhana(almaty, "Dala Palace", "dala-palace", 100, 500, 180000, 600000,
                true, true, wedding, corporate);
        createToikhana(almaty, "Samal Sarai", "samal-sarai", 50, 180, 80000, 250000,
                true, false, khatyn, birthday);
        createToikhana(shymkent, "Turkistan Hall", "turkistan-hall", 70, 260, 95000, 290000,
                true, true, wedding, khatyn);
        createToikhana(shymkent, "Shanyrak Premium", "shanyrak-premium", 120, 400, 200000, 700000,
                true, false, wedding, corporate, birthday);

        recalcCityCounts();
    }

    private City city(String nameKk, String nameRu, String slug) {
        City city = new City();
        city.setNameKk(nameKk);
        city.setNameRu(nameRu);
        city.setSlug(slug);
        return city;
    }

    private ToyType toyType(String nameKk, String nameRu, String slug, String icon) {
        ToyType toyType = new ToyType();
        toyType.setNameKk(nameKk);
        toyType.setNameRu(nameRu);
        toyType.setSlug(slug);
        toyType.setIcon(icon);
        return toyType;
    }

    private void createToikhana(City city,
                                String name,
                                String slug,
                                int minCapacity,
                                int maxCapacity,
                                int minPrice,
                                int maxPrice,
                                boolean active,
                                boolean featured,
                                ToyType... toyTypes) {
        Toikhana toikhana = new Toikhana();
        toikhana.setCityId(city.getId());
        toikhana.setName(name);
        toikhana.setSlug(slug);
        toikhana.setDescriptionKk(name + " - той өткізуге арналған жайлы зал.");
        toikhana.setDescriptionRu(name + " - уютный зал для проведения тоя.");
        toikhana.setAddress(city.getNameRu() + ", орталық аудан");
        toikhana.setPhone("+7 (700) 000-00-00");
        toikhana.setWhatsapp("+77000000000");
        toikhana.setCapacityMin(minCapacity);
        toikhana.setCapacityMax(maxCapacity);
        toikhana.setPriceMin(minPrice);
        toikhana.setPriceMax(maxPrice);
        toikhana.setActive(active);
        toikhana.setFeatured(featured);
        toikhana.setCreatedAt(LocalDateTime.now().minusDays(10));
        toikhana.setToyTypes(new HashSet<ToyType>(Arrays.asList(toyTypes)));
        Toikhana saved = toikhanaRepository.save(toikhana);

        photoRepository.save(photo(saved.getId(), "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80", true, 1));
        photoRepository.save(photo(saved.getId(), "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", false, 2));
        photoRepository.save(photo(saved.getId(), "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80", false, 3));
    }

    private ToikhanaPhoto photo(Long toikhanaId, String url, boolean main, int sortOrder) {
        ToikhanaPhoto photo = new ToikhanaPhoto();
        photo.setToikhanaId(toikhanaId);
        photo.setUrl(url);
        photo.setMain(main);
        photo.setSortOrder(sortOrder);
        return photo;
    }

    private void recalcCityCounts() {
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
