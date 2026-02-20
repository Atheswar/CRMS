package com.crms.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crms.entity.Booking;
import com.crms.entity.BookingStatus;
import com.crms.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking createBooking(
            @RequestParam Long userId,
            @RequestParam Long resourceId,
            @RequestBody Booking bookingRequest
    ) {
        return bookingService.createBooking(userId, resourceId, bookingRequest);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        return bookingService.updateBookingStatus(id, status);
    }

    // Get bookings by user
    @GetMapping("/user/{userId}")
        public List<Booking> getByUser(@PathVariable Long userId) {
            return bookingService.getBookingsByUser(userId);
        }

    // Get bookings by resource
    @GetMapping("/resource/{resourceId}")
    public List<Booking> getByResource(@PathVariable Long resourceId) {
        return bookingService.getBookingsByResource(resourceId);
    }

    // Check availability
    @GetMapping("/check-availability")
    public Map<String, Object> checkAvailability(
            @RequestParam Long resourceId,
            @RequestParam String date,
            @RequestParam String timeSlot
    ) {
        LocalDate bookingDate = LocalDate.parse(date);
        return bookingService.checkAvailability(resourceId, bookingDate, timeSlot);
    }
}
