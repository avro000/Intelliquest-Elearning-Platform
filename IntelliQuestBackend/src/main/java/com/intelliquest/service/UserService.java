package com.intelliquest.service;

import com.intelliquest.dto.UserUpdateRequestDTO;
import com.intelliquest.model.User;
import com.intelliquest.model.UserProfilePicture;
import com.intelliquest.repository.UserProfilePictureRepository;
import com.intelliquest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfilePictureRepository userProfilePictureRepository;
    private final R2StorageService r2StorageService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserProfilePictureRepository userProfilePictureRepository,
                       R2StorageService r2StorageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userProfilePictureRepository = userProfilePictureRepository;
        this.r2StorageService = r2StorageService;
    }

    public void registerUser(String name, String email, String password, User.UserRole role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setRole(role != null ? role : User.UserRole.USER);

        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return false;
        }
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
    
    public boolean updateUserProfile(String email, UserUpdateRequestDTO updateRequest) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().trim().isEmpty()) {
            user.setUsername(updateRequest.getUsername().trim());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().trim().isEmpty()) {
            user.setEmail(updateRequest.getEmail().trim());
        }

        // Handle password change
        if (updateRequest.getCurrentPassword() != null && updateRequest.getNewPassword() != null) {
            if (!passwordEncoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Incorrect current password.");
            }
            user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
        }

        // Handle profile pic remove
        if (Boolean.TRUE.equals(updateRequest.getRemovePicture())) {
            if (user.getProfilePictureUrl() != null && user.getProfilePictureUrl().contains("r2.dev")) {
                r2StorageService.deleteFile(user.getProfilePictureUrl());
            }
            user.setProfilePictureUrl(null);
        }
        // Handle profile pic upload to R2
        else if (updateRequest.getProfilePic() != null && !updateRequest.getProfilePic().isEmpty()) {
            try {
                if (user.getProfilePictureUrl() != null && user.getProfilePictureUrl().contains("r2.dev")) {
                    r2StorageService.deleteFile(user.getProfilePictureUrl());
                }
                String r2Url = r2StorageService.uploadFile(updateRequest.getProfilePic(), "users/profile-pictures");
                user.setProfilePictureUrl(r2Url);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture to R2", e);
            }
        }

        userRepository.save(user);
        return true;
    }
    
    public Optional<UserProfilePicture> getProfilePictureByUserId(Long userId) {
        return userProfilePictureRepository.findByUserId(userId);
    }
}
