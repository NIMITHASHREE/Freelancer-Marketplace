package com.freelance.backend.service;


import com.freelance.backend.dto.*;
import com.freelance.backend.model.*;
import com.freelance.backend.repository.*;
import com.freelance.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final ClientProfileRepository clientProfileRepo;
    private final FreelancerProfileRepository freelancerProfileRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .isVerified(false)
                .build();
        user = userRepo.save(user);

        if (req.getRole() == User.Role.CLIENT) {
            ClientProfile cp = ClientProfile.builder()
                    .user(user)
                    .companyName(req.getCompanyName())
                    .industry(req.getIndustry())
                    .build();
            clientProfileRepo.save(cp);
        } else if (req.getRole() == User.Role.FREELANCER) {
            FreelancerProfile fp = FreelancerProfile.builder()
                    .user(user)
                    .bio(req.getBio())
                    .hourlyRate(req.getHourlyRate() != null
                            ? BigDecimal.valueOf(req.getHourlyRate()) : null)
                    .build();
            freelancerProfileRepo.save(fp);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(),
                user.getFullName(), user.getUserId());
    }

    public AuthResponse login(LoginRequest req) {
        // Authenticate credentials
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        // If we get here, credentials are valid — now fetch our own User from DB
        com.freelance.backend.model.User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(),
                user.getFullName(), user.getUserId());
    }
}
