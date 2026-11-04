package com.intelliquest.security;

import com.intelliquest.model.User;
import com.intelliquest.model.User.UserRole;
import com.intelliquest.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            // Preserve custom uploaded picture if user explicitly uploaded one to R2
            if (user.getProfilePictureUrl() != null && user.getProfilePictureUrl().contains("r2.dev")) {
                // Keep existing custom uploaded picture
            } else if (user.getProfilePictureUrl() == null && picture != null && !picture.isBlank()) {
                user.setProfilePictureUrl(picture);
                user = userRepository.save(user);
            }
        } else {
            user = new User();
            user.setUsername(name != null && !name.isBlank() ? name : email.split("@")[0]);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(UserRole.USER);
            user.setProfilePictureUrl(picture);
            user = userRepository.save(user);
        }
        
        String effectivePicture = user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : picture;
        String jwt = jwtService.generateToken(email, user.getUsername(), effectivePicture, user.getRole().name());
        response.sendRedirect(frontendUrl + "/oauth-success?token=" + jwt);
    }
}
