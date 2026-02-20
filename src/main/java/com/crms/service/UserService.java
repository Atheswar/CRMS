package com.crms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.crms.repository.UserRepository;
import com.crms.entity.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(UserStatus.ACTIVE);
        return userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }
}