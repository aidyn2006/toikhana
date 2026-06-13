package com.example.toikhana.service;

import com.example.toikhana.dto.AuthResponse;
import com.example.toikhana.dto.LoginRequest;
import com.example.toikhana.dto.RegisterRequest;
import com.example.toikhana.dto.UserDto;
import com.example.toikhana.exception.BadRequestException;
import com.example.toikhana.model.AppUser;
import com.example.toikhana.repository.UserRepository;
import com.example.toikhana.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email уже зарегистрирован");
        }
        AppUser user = new AppUser();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        AppUser saved = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(saved), UserDto.from(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Неверный email или пароль"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Неверный email или пароль");
        }
        return new AuthResponse(jwtService.generateToken(user), UserDto.from(user));
    }
}
