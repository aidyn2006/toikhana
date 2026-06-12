package com.example.toikhana.init;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import com.example.toikhana.model.BlogPost;
import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.model.ToikhanaPhoto;
import com.example.toikhana.model.ToyType;
import com.example.toikhana.repository.BlogPostRepository;
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
    private final BlogPostRepository blogPostRepository;

    public DataLoader(CityRepository cityRepository,
                      ToyTypeRepository toyTypeRepository,
                      ToikhanaRepository toikhanaRepository,
                      ToikhanaPhotoRepository photoRepository,
                      BlogPostRepository blogPostRepository) {
        this.cityRepository = cityRepository;
        this.toyTypeRepository = toyTypeRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
        this.blogPostRepository = blogPostRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (cityRepository.count() > 0 || toikhanaRepository.count() > 0) {
            return;
        }

        // Республикалық маңызы бар қалалар мен барлық облыс орталықтары
        List<City> cities = cityRepository.saveAll(Arrays.asList(
                city("Астана", "Астана", "astana"),
                city("Алматы", "Алматы", "almaty"),
                city("Шымкент", "Шымкент", "shymkent"),
                city("Қарағанды", "Караганда", "karaganda"),
                city("Ақтөбе", "Актобе", "aktobe"),
                city("Тараз", "Тараз", "taraz"),
                city("Павлодар", "Павлодар", "pavlodar"),
                city("Өскемен", "Усть-Каменогорск", "ust-kamenogorsk"),
                city("Семей", "Семей", "semey"),
                city("Атырау", "Атырау", "atyrau"),
                city("Қостанай", "Костанай", "kostanay"),
                city("Қызылорда", "Кызылорда", "kyzylorda"),
                city("Орал", "Уральск", "uralsk"),
                city("Петропавл", "Петропавловск", "petropavlovsk"),
                city("Ақтау", "Актау", "aktau"),
                city("Теміртау", "Темиртау", "temirtau"),
                city("Түркістан", "Туркестан", "turkestan"),
                city("Көкшетау", "Кокшетау", "kokshetau"),
                city("Талдықорған", "Талдыкорган", "taldykorgan"),
                city("Екібастұз", "Экибастуз", "ekibastuz"),
                city("Рудный", "Рудный", "rudny"),
                city("Жезқазған", "Жезказган", "zhezkazgan"),
                city("Қонаев", "Конаев", "konaev")
        ));
        City astana = cities.get(0);
        City almaty = cities.get(1);
        City shymkent = cities.get(2);
        City karaganda = cities.get(3);
        City aktobe = cities.get(4);
        City atyrau = cities.get(9);

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
        createToikhana(karaganda, "Saryarka Hall", "saryarka-hall", 80, 350, 110000, 380000,
                true, true, wedding, corporate);
        createToikhana(karaganda, "Altyn Toi", "altyn-toi", 60, 200, 85000, 240000,
                true, false, wedding, birthday);
        createToikhana(aktobe, "Aktobe Palace", "aktobe-palace", 90, 320, 100000, 350000,
                true, true, wedding, khatyn);
        createToikhana(atyrau, "Caspian Hall", "caspian-hall", 70, 280, 130000, 420000,
                true, true, wedding, corporate);

        recalcCityCounts();
        seedBlogPosts();
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

    private void seedBlogPosts() {
        if (blogPostRepository.count() > 0) {
            return;
        }
        blogPostRepository.save(blogPost(
                "Как выбрать тойхану: 7 шагов к идеальному залу",
                "kak-vybrat-toikhanu",
                "Пошаговый гид по выбору банкетного зала в Казахстане: бюджет, вместимость, локация и договор.",
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
                "Выбор тойханы — один из ключевых этапов подготовки к торжеству. Ниже — проверенный план.\n\n"
                        + "1. Определите бюджет. Заложите 30–40% общей сметы тоя на аренду и кейтеринг зала.\n"
                        + "2. Посчитайте гостей. Уточняйте вместимость зала при банкетной рассадке, а не «стоя».\n"
                        + "3. Выберите район. Близость к центру и парковка важны для гостей старшего возраста.\n"
                        + "4. Сравните несколько залов. Используйте каталог toikhana.kz, чтобы смотреть фото и цены в одном месте.\n"
                        + "5. Уточните, что входит в стоимость: посуда, текстиль, тамада, звук, декор.\n"
                        + "6. Посетите зал лично и проверьте кухню, санузлы, кондиционирование.\n"
                        + "7. Зафиксируйте всё в договоре: дату, предоплату, условия возврата.\n\n"
                        + "Совет: бронируйте популярные залы за 3–6 месяцев, особенно на сезон свадеб.",
                10));
        blogPostRepository.save(blogPost(
                "Сколько стоит свадьба в Казахстане в 2026 году",
                "skolko-stoit-svadba-2026",
                "Разбираем реальные цены на тойхану, кейтеринг и оформление по городам Казахстана.",
                "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
                "Стоимость свадьбы складывается из аренды зала, меню на человека, декора и услуг ведущего.\n\n"
                        + "Аренда тойханы: от 90 000 ₸ в небольших городах до 700 000 ₸ за премиум-залы в Астане и Алматы.\n"
                        + "Меню: в среднем 8 000–20 000 ₸ на гостя в зависимости от города и уровня кухни.\n"
                        + "Оформление и флористика: 150 000–600 000 ₸.\n"
                        + "Ведущий и музыка: 200 000–500 000 ₸.\n\n"
                        + "Чтобы сэкономить без потери качества, сравнивайте предложения залов в вашем городе через каталог toikhana.kz "
                        + "и бронируйте вне пикового сезона.",
                7));
        blogPostRepository.save(blogPost(
                "Тойхана на день рождения: чек-лист организатора",
                "toikhana-na-den-rozhdeniya",
                "Что учесть при аренде зала на день рождения — от детского тоя до юбилея.",
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
                "День рождения в тойхане — удобный формат, когда гостей много, а готовить дома неудобно.\n\n"
                        + "• Уточните минимальный депозит и сумму счёта.\n"
                        + "• Спросите про детскую зону и аниматоров, если праздник семейный.\n"
                        + "• Проверьте, можно ли приносить свой торт и напитки.\n"
                        + "• Согласуйте тайминг: вход, банкет, развлекательная программа.\n\n"
                        + "В каталоге toikhana.kz можно отфильтровать залы по вместимости и формату тоя в вашем городе.",
                3));
    }

    private BlogPost blogPost(String title, String slug, String excerpt, String coverUrl, String body, int daysAgo) {
        BlogPost post = new BlogPost();
        post.setTitle(title);
        post.setSlug(slug);
        post.setExcerpt(excerpt);
        post.setCoverUrl(coverUrl);
        post.setBody(body);
        post.setPublished(true);
        post.setPublishedAt(LocalDateTime.now().minusDays(daysAgo));
        return post;
    }
}
