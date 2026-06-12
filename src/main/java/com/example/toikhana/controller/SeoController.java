package com.example.toikhana.controller;

import java.time.format.DateTimeFormatter;

import com.example.toikhana.model.BlogPost;
import com.example.toikhana.model.City;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.repository.BlogPostRepository;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SeoController {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ISO_LOCAL_DATE;

    private final CityRepository cityRepository;
    private final ToikhanaRepository toikhanaRepository;
    private final BlogPostRepository blogPostRepository;

    @Value("${toikhana.site.base-url}")
    private String baseUrl;

    public SeoController(CityRepository cityRepository,
                         ToikhanaRepository toikhanaRepository,
                         BlogPostRepository blogPostRepository) {
        this.cityRepository = cityRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.blogPostRepository = blogPostRepository;
    }

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String robots() {
        StringBuilder sb = new StringBuilder();
        sb.append("User-agent: *\n");
        sb.append("Allow: /\n");
        sb.append("Disallow: /admin\n");
        sb.append("Disallow: /api/\n\n");
        sb.append("Sitemap: ").append(base()).append("/sitemap.xml\n");
        return sb.toString();
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String sitemap() {
        String base = base();
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        url(sb, base + "/", "1.0", null);
        url(sb, base + "/blog", "0.7", null);
        url(sb, base + "/about", "0.4", null);
        url(sb, base + "/contacts", "0.4", null);
        url(sb, base + "/add-toikhana", "0.5", null);

        for (City city : cityRepository.findAll()) {
            url(sb, base + "/" + city.getSlug(), "0.8", null);
        }
        for (Toikhana toikhana : toikhanaRepository.findAll()) {
            if (toikhana.isActive()) {
                url(sb, base + "/toikhana/" + toikhana.getSlug(), "0.9", null);
            }
        }
        for (BlogPost post : blogPostRepository.findByPublishedTrueOrderByPublishedAtDesc()) {
            String lastmod = post.getPublishedAt() != null ? post.getPublishedAt().toLocalDate().format(DATE) : null;
            url(sb, base + "/blog/" + post.getSlug(), "0.6", lastmod);
        }

        sb.append("</urlset>\n");
        return sb.toString();
    }

    private void url(StringBuilder sb, String loc, String priority, String lastmod) {
        sb.append("  <url>\n");
        sb.append("    <loc>").append(escape(loc)).append("</loc>\n");
        if (lastmod != null) {
            sb.append("    <lastmod>").append(lastmod).append("</lastmod>\n");
        }
        sb.append("    <priority>").append(priority).append("</priority>\n");
        sb.append("  </url>\n");
    }

    private String base() {
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            return "";
        }
        String trimmed = baseUrl.trim();
        return trimmed.endsWith("/") ? trimmed.substring(0, trimmed.length() - 1) : trimmed;
    }

    private String escape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
