package com.example.toikhana.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.example.toikhana.dto.AdminBookingStatusRequest;
import com.example.toikhana.dto.AdminToikhanaRequest;
import com.example.toikhana.dto.BookingDto;
import com.example.toikhana.dto.PhotoDto;
import com.example.toikhana.dto.ToikhanaDetailDto;
import com.example.toikhana.dto.ToikhanaListItemDto;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.repository.CityRepository;
import com.example.toikhana.service.AdminService;
import com.example.toikhana.service.BookingService;
import com.example.toikhana.service.CatalogService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final CatalogService catalogService;
    private final BookingService bookingService;
    private final CityRepository cityRepository;

    public AdminController(AdminService adminService,
                           CatalogService catalogService,
                           BookingService bookingService,
                           CityRepository cityRepository) {
        this.adminService = adminService;
        this.catalogService = catalogService;
        this.bookingService = bookingService;
        this.cityRepository = cityRepository;
    }

    @GetMapping("/toikhanas")
    public List<ToikhanaListItemDto> listToikhanas() {
        List<ToikhanaListItemDto> result = new ArrayList<ToikhanaListItemDto>();
        for (Toikhana toikhana : adminService.list()) {
            result.add(catalogService.toListItemDto(toikhana));
        }
        return result;
    }

    @PostMapping("/toikhanas")
    public ToikhanaDetailDto createToikhana(@Valid @org.springframework.web.bind.annotation.RequestBody AdminToikhanaRequest request) {
        return catalogService.toDetailDto(adminService.save(request));
    }

    @PutMapping("/toikhanas/{id}")
    public ToikhanaDetailDto updateToikhana(@PathVariable Long id,
                                            @Valid @org.springframework.web.bind.annotation.RequestBody AdminToikhanaRequest request) {
        return catalogService.toDetailDto(adminService.update(id, request));
    }

    @DeleteMapping("/toikhanas/{id}")
    public Map<String, Object> deleteToikhana(@PathVariable Long id) {
        adminService.delete(id);
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("deleted", true);
        return response;
    }

    @PostMapping("/toikhanas/{id}/photos")
    public PhotoDto uploadPhoto(@PathVariable Long id,
                                @RequestParam(value = "isMain", defaultValue = "false") boolean isMain,
                                @RequestParam(value = "sortOrder", required = false) Integer sortOrder,
                                @RequestPart("file") MultipartFile file) {
        return adminService.addPhoto(id, file, isMain, sortOrder);
    }

    @GetMapping("/bookings")
    public List<BookingDto> listBookings() {
        return bookingService.listAll();
    }

    @PutMapping("/bookings/{id}/status")
    public BookingDto changeStatus(@PathVariable Long id, @Valid @org.springframework.web.bind.annotation.RequestBody AdminBookingStatusRequest request) {
        return bookingService.updateStatus(id, request.getStatus());
    }
}
