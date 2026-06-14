package com.example.toikhana.init;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;

import com.example.toikhana.model.AppUser;
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
import com.example.toikhana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds reference data. Every step is idempotent (insert-if-missing by slug), so
 * it both bootstraps a fresh database and tops up older databases that were
 * seeded with fewer cities/halls — without wiping anything.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private static final String[] STOCK_PHOTOS = {
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
    };

    private final CityRepository cityRepository;
    private final ToyTypeRepository toyTypeRepository;
    private final ToikhanaRepository toikhanaRepository;
    private final ToikhanaPhotoRepository photoRepository;
    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataLoader(CityRepository cityRepository,
                      ToyTypeRepository toyTypeRepository,
                      ToikhanaRepository toikhanaRepository,
                      ToikhanaPhotoRepository photoRepository,
                      BlogPostRepository blogPostRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${toikhana.admin.email:admin@toikhana.kz}") String adminEmail,
                      @Value("${toikhana.admin.password:admin123}") String adminPassword) {
        this.cityRepository = cityRepository;
        this.toyTypeRepository = toyTypeRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.photoRepository = photoRepository;
        this.blogPostRepository = blogPostRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Республикалық маңызы бар қалалар мен барлық облыс орталықтары
        ensureCity("Астана", "Астана", "astana");
        ensureCity("Алматы", "Алматы", "almaty");
        ensureCity("Шымкент", "Шымкент", "shymkent");
        ensureCity("Қарағанды", "Караганда", "karaganda");
        ensureCity("Ақтөбе", "Актобе", "aktobe");
        ensureCity("Тараз", "Тараз", "taraz");
        ensureCity("Павлодар", "Павлодар", "pavlodar");
        ensureCity("Өскемен", "Усть-Каменогорск", "ust-kamenogorsk");
        ensureCity("Семей", "Семей", "semey");
        ensureCity("Атырау", "Атырау", "atyrau");
        ensureCity("Қостанай", "Костанай", "kostanay");
        ensureCity("Қызылорда", "Кызылорда", "kyzylorda");
        ensureCity("Орал", "Уральск", "uralsk");
        ensureCity("Петропавл", "Петропавловск", "petropavlovsk");
        ensureCity("Ақтау", "Актау", "aktau");
        ensureCity("Теміртау", "Темиртау", "temirtau");
        ensureCity("Түркістан", "Туркестан", "turkestan");
        ensureCity("Көкшетау", "Кокшетау", "kokshetau");
        ensureCity("Талдықорған", "Талдыкорган", "taldykorgan");
        ensureCity("Екібастұз", "Экибастуз", "ekibastuz");
        ensureCity("Рудный", "Рудный", "rudny");
        ensureCity("Жезқазған", "Жезказган", "zhezkazgan");
        ensureCity("Қонаев", "Конаев", "konaev");

        ToyType wedding = ensureToyType("Үйлену тойы", "Свадьба", "svadba", "rings");
        ToyType kudalyk = ensureToyType("Құдалық", "Сватовство", "kudalyk", "people");
        ToyType birthday = ensureToyType("Туған күн", "День рождения", "birthday", "cake");
        ToyType corporate = ensureToyType("Корпоратив", "Корпоратив", "corporate", "briefcase");

        // Каталог: барлық ірі қалаларда залдар (catalog spread across all major cities)
        ensureToikhana("astana", "Aq Orda Hall", "aq-orda-hall", 80, 300, 120000, 450000, true, wedding, kudalyk);
        ensureToikhana("astana", "Royal Garden", "royal-garden", 60, 220, 90000, 320000, true, wedding, birthday);
        ensureToikhana("astana", "Astana Grand Hall", "astana-grand-hall", 150, 600, 220000, 800000, true, wedding, corporate);
        ensureToikhana("almaty", "Dala Palace", "dala-palace", 100, 500, 180000, 600000, true, wedding, corporate);
        ensureToikhana("almaty", "Samal Sarai", "samal-sarai", 50, 180, 80000, 250000, false, kudalyk, birthday);
        ensureToikhana("almaty", "Alatau Premium", "alatau-premium", 120, 450, 200000, 700000, true, wedding, corporate);
        ensureToikhana("shymkent", "Turkistan Hall", "turkistan-hall", 70, 260, 95000, 290000, true, wedding, kudalyk);
        ensureToikhana("shymkent", "Shanyrak Premium", "shanyrak-premium", 120, 400, 200000, 700000, false, wedding, corporate, birthday);
        ensureToikhana("karaganda", "Saryarka Hall", "saryarka-hall", 80, 350, 110000, 380000, true, wedding, corporate);
        ensureToikhana("karaganda", "Altyn Toi", "altyn-toi", 60, 200, 85000, 240000, false, wedding, birthday);
        ensureToikhana("aktobe", "Aktobe Palace", "aktobe-palace", 90, 320, 100000, 350000, true, wedding, kudalyk);
        ensureToikhana("aktobe", "Aliya Hall", "aliya-hall", 50, 180, 75000, 220000, false, birthday, kudalyk);
        ensureToikhana("atyrau", "Caspian Hall", "caspian-hall", 70, 280, 130000, 420000, true, wedding, corporate);
        ensureToikhana("taraz", "Taraz Sarai", "taraz-sarai", 60, 250, 90000, 300000, true, wedding, kudalyk);
        ensureToikhana("pavlodar", "Ertis Hall", "ertis-hall", 70, 260, 95000, 310000, true, wedding, corporate);
        ensureToikhana("ust-kamenogorsk", "Altai Palace", "altai-palace", 80, 300, 100000, 340000, true, wedding, birthday);
        ensureToikhana("semey", "Abai Hall", "abai-hall", 60, 220, 85000, 270000, true, wedding, kudalyk);
        ensureToikhana("kostanay", "Tobol Sarai", "tobol-sarai", 70, 240, 90000, 290000, true, wedding, corporate);
        ensureToikhana("kyzylorda", "Syrdariya Hall", "syrdariya-hall", 60, 230, 85000, 260000, true, wedding, kudalyk);
        ensureToikhana("uralsk", "Oral Premium", "oral-premium", 80, 300, 100000, 330000, true, wedding, corporate);
        ensureToikhana("petropavlovsk", "Qyzyljar Hall", "qyzyljar-hall", 60, 220, 85000, 250000, true, wedding, birthday);
        ensureToikhana("aktau", "Aktau Marine Hall", "aktau-marine-hall", 90, 350, 140000, 460000, true, wedding, corporate);
        ensureToikhana("temirtau", "Metallurg Hall", "metallurg-hall", 60, 240, 80000, 250000, true, wedding, corporate);
        ensureToikhana("turkestan", "Azret Sultan Sarai", "azret-sultan-sarai", 100, 400, 120000, 380000, true, wedding, kudalyk);
        ensureToikhana("kokshetau", "Burabai Hall", "burabai-hall", 70, 260, 95000, 300000, true, wedding, birthday);
        ensureToikhana("taldykorgan", "Jetisu Sarai", "jetisu-sarai", 60, 230, 85000, 270000, true, wedding, kudalyk);
        ensureToikhana("ekibastuz", "Energetik Hall", "energetik-hall", 50, 200, 75000, 220000, true, wedding, corporate);
        ensureToikhana("rudny", "Rudny Palace", "rudny-palace", 50, 190, 70000, 210000, true, wedding, birthday);
        ensureToikhana("zhezkazgan", "Ulytau Hall", "ulytau-hall", 60, 220, 80000, 240000, true, wedding, kudalyk);
        ensureToikhana("konaev", "Balqash Hall", "balqash-hall", 70, 280, 100000, 320000, true, wedding, corporate);

        recalcCityCounts();
        seedBlogPosts();
        ensureAdminUser();
    }

    /** Make sure an admin account exists so /admin is reachable via normal login. */
    private void ensureAdminUser() {
        if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
            return;
        }
        AppUser admin = new AppUser();
        admin.setName("Администратор");
        admin.setEmail(adminEmail.toLowerCase());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }

    private City ensureCity(String nameKk, String nameRu, String slug) {
        return cityRepository.findBySlug(slug).orElseGet(() -> {
            City city = new City();
            city.setNameKk(nameKk);
            city.setNameRu(nameRu);
            city.setSlug(slug);
            return cityRepository.save(city);
        });
    }

    private ToyType ensureToyType(String nameKk, String nameRu, String slug, String icon) {
        return toyTypeRepository.findBySlug(slug).orElseGet(() -> {
            ToyType toyType = new ToyType();
            toyType.setNameKk(nameKk);
            toyType.setNameRu(nameRu);
            toyType.setSlug(slug);
            toyType.setIcon(icon);
            return toyTypeRepository.save(toyType);
        });
    }

    private void ensureToikhana(String citySlug,
                                String name,
                                String slug,
                                int minCapacity,
                                int maxCapacity,
                                int minPrice,
                                int maxPrice,
                                boolean featured,
                                ToyType... toyTypes) {
        if (toikhanaRepository.findBySlug(slug).isPresent()) {
            return;
        }
        City city = cityRepository.findBySlug(citySlug).orElse(null);
        if (city == null) {
            return;
        }
        Toikhana toikhana = new Toikhana();
        toikhana.setCityId(city.getId());
        toikhana.setName(name);
        toikhana.setSlug(slug);
        toikhana.setDescriptionKk(name + " — той өткізуге арналған жайлы зал. Заманауи интерьер, дәмді ас және сапалы қызмет.");
        toikhana.setDescriptionRu(name + " — уютный зал для проведения тоя. Современный интерьер, вкусная кухня и сервис.");
        toikhana.setAddress(city.getNameRu() + ", центральный район");
        toikhana.setPhone("+7 (700) 000-00-00");
        toikhana.setWhatsapp("+77000000000");
        toikhana.setCapacityMin(minCapacity);
        toikhana.setCapacityMax(maxCapacity);
        toikhana.setPriceMin(minPrice);
        toikhana.setPriceMax(maxPrice);
        toikhana.setActive(true);
        toikhana.setFeatured(featured);
        toikhana.setCreatedAt(LocalDateTime.now().minusDays(10));
        toikhana.setToyTypes(new HashSet<ToyType>(Arrays.asList(toyTypes)));
        Toikhana saved = toikhanaRepository.save(toikhana);

        for (int i = 0; i < STOCK_PHOTOS.length; i++) {
            photoRepository.save(photo(saved.getId(), STOCK_PHOTOS[i], i == 0, i + 1));
        }
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
        java.util.List<Toikhana> all = toikhanaRepository.findAll();
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
