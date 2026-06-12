package com.example.toikhana.service;

import java.util.ArrayList;
import java.util.List;

import com.example.toikhana.dto.OwnerApplicationCreateRequest;
import com.example.toikhana.dto.OwnerApplicationDto;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.OwnerApplication;
import com.example.toikhana.repository.OwnerApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OwnerApplicationService {

    private final OwnerApplicationRepository ownerApplicationRepository;

    public OwnerApplicationService(OwnerApplicationRepository ownerApplicationRepository) {
        this.ownerApplicationRepository = ownerApplicationRepository;
    }

    public OwnerApplicationDto create(OwnerApplicationCreateRequest request) {
        OwnerApplication application = new OwnerApplication();
        application.setName(trim(request.getName()));
        application.setCity(trim(request.getCity()));
        application.setPhone(trim(request.getPhone()));
        application.setWhatsapp(trimToNull(request.getWhatsapp()));
        application.setHallName(trimToNull(request.getHallName()));
        application.setMessage(trimToNull(request.getMessage()));
        application.setStatus("new");
        return toDto(ownerApplicationRepository.save(application));
    }

    public List<OwnerApplicationDto> listAll() {
        List<OwnerApplicationDto> result = new ArrayList<OwnerApplicationDto>();
        for (OwnerApplication application : ownerApplicationRepository.findAllByOrderByCreatedAtDesc()) {
            result.add(toDto(application));
        }
        return result;
    }

    public OwnerApplicationDto updateStatus(Long id, String status) {
        OwnerApplication application = ownerApplicationRepository.findById(id)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Owner application not found");
                    }
                });
        application.setStatus(status);
        return toDto(ownerApplicationRepository.save(application));
    }

    private OwnerApplicationDto toDto(OwnerApplication application) {
        OwnerApplicationDto dto = new OwnerApplicationDto();
        dto.setId(application.getId());
        dto.setName(application.getName());
        dto.setCity(application.getCity());
        dto.setPhone(application.getPhone());
        dto.setWhatsapp(application.getWhatsapp());
        dto.setHallName(application.getHallName());
        dto.setMessage(application.getMessage());
        dto.setStatus(application.getStatus());
        dto.setCreatedAt(application.getCreatedAt());
        return dto;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
