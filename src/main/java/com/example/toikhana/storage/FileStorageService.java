package com.example.toikhana.storage;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${toikhana.storage.upload-dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String storeToikhanaPhoto(Long toikhanaId, MultipartFile file) {
        try {
            Files.createDirectories(uploadDir.resolve("toikhanas").resolve(String.valueOf(toikhanaId)));
            String original = file.getOriginalFilename();
            String extension = "";
            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf('.'));
            }
            String fileName = UUID.randomUUID().toString().replace("-", "") + extension;
            Path target = uploadDir.resolve("toikhanas").resolve(String.valueOf(toikhanaId)).resolve(fileName);
            file.transferTo(target.toFile());
            return "/uploads/toikhanas/" + toikhanaId + "/" + fileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file", ex);
        }
    }

    /**
     * Downloads a remote image (e.g. a 2GIS photo URL) and stores it
     * the same way as an uploaded photo. Returns the public relative path.
     */
    public String storeToikhanaPhotoFromUrl(Long toikhanaId, String imageUrl) {
        HttpURLConnection conn = null;
        try {
            Files.createDirectories(uploadDir.resolve("toikhanas").resolve(String.valueOf(toikhanaId)));
            URL url = new URL(imageUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; ToikhanaImporter/1.0)");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(30000);
            conn.setInstanceFollowRedirects(true);
            int code = conn.getResponseCode();
            if (code != HttpURLConnection.HTTP_OK) {
                throw new IllegalStateException("Photo download returned HTTP " + code + " for " + imageUrl);
            }
            String extension = resolveExtension(imageUrl, conn.getContentType());
            String fileName = UUID.randomUUID().toString().replace("-", "") + extension;
            Path target = uploadDir.resolve("toikhanas").resolve(String.valueOf(toikhanaId)).resolve(fileName);
            try (InputStream in = conn.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/toikhanas/" + toikhanaId + "/" + fileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to download photo: " + imageUrl, ex);
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private String resolveExtension(String imageUrl, String contentType) {
        if (contentType != null) {
            String ct = contentType.toLowerCase();
            if (ct.contains("jpeg") || ct.contains("jpg")) {
                return ".jpg";
            }
            if (ct.contains("png")) {
                return ".png";
            }
            if (ct.contains("webp")) {
                return ".webp";
            }
            if (ct.contains("gif")) {
                return ".gif";
            }
        }
        String path = imageUrl;
        int q = path.indexOf('?');
        if (q >= 0) {
            path = path.substring(0, q);
        }
        int dot = path.lastIndexOf('.');
        if (dot >= 0 && path.length() - dot <= 5) {
            return path.substring(dot).toLowerCase();
        }
        return ".jpg";
    }

    public Path getUploadDir() {
        return uploadDir;
    }
}
