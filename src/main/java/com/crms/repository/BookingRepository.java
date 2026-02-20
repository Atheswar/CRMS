package com.crms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.crms.entity.*;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByResourceAndBookingDateAndTimeSlotAndStatusNot(
            Resource resource,
            LocalDate bookingDate,
            String timeSlot,
            BookingStatus status
    );

    List<Booking> findByUserId(Long userId);
    List<Booking> findByResourceId(Long resourceId);

}
