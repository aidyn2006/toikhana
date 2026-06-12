package com.example.toikhana.controller;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import com.example.toikhana.dto.BookingCreateRequest;
import com.example.toikhana.dto.BookingDto;
import com.example.toikhana.service.BookingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Map<String, Object> create(@Valid @RequestBody BookingCreateRequest request) {
        BookingDto booking = bookingService.create(request);
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("booking", booking);
        result.put("success", true);
        return result;
    }
}
