package com.example.minicrm.service;

import com.example.minicrm.dto.UserRequest;
import com.example.minicrm.dto.UserResponse;
import com.example.minicrm.entity.User;
import com.example.minicrm.exception.DuplicateResourceException;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.UserRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return toResponse(getUser(id));
    }

    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("User email already exists: " + request.email());
        }
        User user = new User();
        applyRequest(user, request);
        return toResponse(userRepository.save(user));
    }

    public UserResponse update(Long id, UserRequest request) {
        User user = getUser(id);
        if (userRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new DuplicateResourceException("User email already exists: " + request.email());
        }
        applyRequest(user, request);
        return toResponse(user);
    }

    public void delete(Long id) {
        User user = getUser(id);
        userRepository.delete(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private void applyRequest(User user, UserRequest request) {
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
