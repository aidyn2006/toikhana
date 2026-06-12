package com.example.toikhana.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    public Path getUploadDir() {
        return uploadDir;
    }
}
