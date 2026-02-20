package com.crms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.crms.entity.User;
import com.crms.entity.UserStatus;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByStatus(UserStatus status);
    Optional<User> findByEmail(String email);   

}
