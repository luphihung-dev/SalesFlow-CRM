package com.example.minicrm.service;

import com.example.minicrm.dto.UserRequest;
import com.example.minicrm.dto.UserResponse;
import com.example.minicrm.entity.Team;
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
    private final TeamService teamService;
    private final CurrentUserService currentUserService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TeamService teamService, CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.teamService = teamService;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return userRepository.findAll().stream().map(this::toResponse).toList();
        }
        if (currentUserService.isManager(currentUser)) {
            Long teamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
            return userRepository.findAll().stream()
                    .filter((user) -> teamId != null && user.getTeam() != null && teamId.equals(user.getTeam().getId()))
                    .map(this::toResponse)
                    .toList();
        }
        return List.of(toResponse(currentUser));
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        User user = getUser(id);
        verifyReadable(user);
        return toResponse(user);
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

    private void verifyReadable(User user) {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser) || user.getId().equals(currentUser.getId())) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        Long userTeamId = user.getTeam() == null ? null : user.getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(userTeamId)) {
            return;
        }
        throw new ResourceNotFoundException("User not found with id: " + user.getId());
    }

    private void applyRequest(User user, UserRequest request) {
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        Team team = request.teamId() == null ? null : teamService.getTeam(request.teamId());
        user.setTeam(team);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getTeam() == null ? null : user.getTeam().getId(),
                user.getTeam() == null ? null : user.getTeam().getName()
        );
    }
}
