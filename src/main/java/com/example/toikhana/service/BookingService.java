package com.example.toikhana.service;

import java.util.ArrayList;
import java.util.List;

import com.example.toikhana.dto.BookingCreateRequest;
import com.example.toikhana.dto.BookingDto;
import com.example.toikhana.exception.BadRequestException;
import com.example.toikhana.exception.NotFoundException;
import com.example.toikhana.model.Booking;
import com.example.toikhana.model.Toikhana;
import com.example.toikhana.repository.BookingRepository;
import com.example.toikhana.repository.ToikhanaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ToikhanaRepository toikhanaRepository;
    private final CatalogService catalogService;

    public BookingService(BookingRepository bookingRepository,
                          ToikhanaRepository toikhanaRepository,
                          CatalogService catalogService) {
        this.bookingRepository = bookingRepository;
        this.toikhanaRepository = toikhanaRepository;
        this.catalogService = catalogService;
    }

    public BookingDto create(BookingCreateRequest request) {
        Toikhana toikhana = toikhanaRepository.findById(request.getToikhanaId())
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Toikhana not found");
                    }
                });
        if (!toikhana.isActive()) {
            throw new BadRequestException("Toikhana is inactive");
        }
        if (request.getEventDate() != null && request.getEventDate().isBefore(java.time.LocalDate.now())) {
            throw new BadRequestException("Event date must be today or later");
        }

        Booking booking = new Booking();
        booking.setToikhanaId(toikhana.getId());
        booking.setName(request.getName().trim());
        booking.setPhone(request.getPhone().trim());
        booking.setEventDate(request.getEventDate());
        booking.setGuestsCount(request.getGuestsCount());
        booking.setMessage(request.getMessage());
        booking.setStatus("new");
        bookingRepository.save(booking);
        return toDto(booking, toikhana.getName());
    }

    public List<BookingDto> listAll() {
        List<BookingDto> result = new ArrayList<BookingDto>();
        for (Booking booking : bookingRepository.findAllByOrderByCreatedAtDesc()) {
            Toikhana toikhana = toikhanaRepository.findById(booking.getToikhanaId()).orElse(null);
            result.add(toDto(booking, toikhana != null ? toikhana.getName() : null));
        }
        return result;
    }

    public BookingDto updateStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(new java.util.function.Supplier<NotFoundException>() {
                    @Override
                    public NotFoundException get() {
                        return new NotFoundException("Booking not found");
                    }
                });
        booking.setStatus(status);
        bookingRepository.save(booking);
        Toikhana toikhana = toikhanaRepository.findById(booking.getToikhanaId()).orElse(null);
        return toDto(booking, toikhana != null ? toikhana.getName() : null);
    }

    private BookingDto toDto(Booking booking, String toikhanaName) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setToikhanaId(booking.getToikhanaId());
        dto.setToikhanaName(toikhanaName);
        dto.setName(booking.getName());
        dto.setPhone(booking.getPhone());
        dto.setEventDate(booking.getEventDate());
        dto.setGuestsCount(booking.getGuestsCount());
        dto.setMessage(booking.getMessage());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
