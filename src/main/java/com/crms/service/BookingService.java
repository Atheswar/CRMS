package com.crms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.crms.entity.*;
import com.crms.repository.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    // 1️⃣ Create Booking
    public Booking createBooking(Long userId, Long resourceId, Booking bookingRequest) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        // 🔥 Conflict Check
        boolean exists = bookingRepository
                .existsByResourceAndBookingDateAndTimeSlotAndStatusNot(
                        resource,
                        bookingRequest.getBookingDate(),
                        bookingRequest.getTimeSlot(),
                        BookingStatus.REJECTED
                );

        if (exists) {
            throw new RuntimeException("Resource already booked for this slot");
        }

        bookingRequest.setUser(user);
        bookingRequest.setResource(resource);

        // 🔥 Role-Based Status
        if (user.getRole().name().equals("ADMIN")) {
            bookingRequest.setStatus(BookingStatus.APPROVED);
        } else {
            bookingRequest.setStatus(BookingStatus.PENDING);
        }

        return bookingRepository.save(bookingRequest);
    }

    // 2️⃣ Get All
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 3️⃣ ✅ ADD THIS METHOD HERE
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }

    // 3️⃣ Get bookings by user
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

// 4️⃣ Get bookings by resource
    public List<Booking> getBookingsByResource(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId);
    }

    // 5️⃣ Check Availability
    public Map<String, Object> checkAvailability(Long resourceId, LocalDate date, String timeSlot) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        boolean exists = bookingRepository
                .existsByResourceAndBookingDateAndTimeSlotAndStatusNot(
                        resource,
                        date,
                        timeSlot,
                        BookingStatus.REJECTED
                );

        Map<String, Object> result = new HashMap<>();
        result.put("available", !exists);
        result.put("resourceId", resourceId);
        result.put("date", date.toString());
        result.put("timeSlot", timeSlot);
        return result;
    }
}
