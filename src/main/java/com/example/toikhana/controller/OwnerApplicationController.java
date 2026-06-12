package com.example.toikhana.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.example.toikhana.dto.OwnerApplicationCreateRequest;
import com.example.toikhana.dto.OwnerApplicationDto;
import com.example.toikhana.dto.OwnerApplicationStatusRequest;
import com.example.toikhana.service.OwnerApplicationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OwnerApplicationController {

    private final OwnerApplicationService ownerApplicationService;

    public OwnerApplicationController(OwnerApplicationService ownerApplicationService) {
        this.ownerApplicationService = ownerApplicationService;
    }

    @PostMapping("/owner-applications")
    public Map<String, Object> create(@Valid @RequestBody OwnerApplicationCreateRequest request) {
        OwnerApplicationDto application = ownerApplicationService.create(request);
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("application", application);
        response.put("success", true);
        return response;
    }

    @GetMapping("/admin/owner-applications")
    public List<OwnerApplicationDto> list() {
        return ownerApplicationService.listAll();
    }

    @PutMapping("/admin/owner-applications/{id}/status")
    public OwnerApplicationDto updateStatus(@PathVariable Long id, @Valid @RequestBody OwnerApplicationStatusRequest request) {
        return ownerApplicationService.updateStatus(id, request.getStatus());
    }
}
