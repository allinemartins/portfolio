package com.allinemartins.auth.controller;

import com.allinemartins.auth.dto.LoginRequest;
import com.allinemartins.auth.dto.LoginResponse;
import com.allinemartins.auth.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String sessionId = authService.login(
                request.username(),
                request.password()
        );

        return new LoginResponse(sessionId);
    }

    @GetMapping("/me")
    public Map<String, String> me(
            @RequestHeader("X-Session-Id") String sessionId
    ) {
        String username = authService.getCurrentUser(sessionId);
        return Map.of("username", username);
    }

    @PostMapping("/logout")
    public void logout(
            @RequestHeader("X-Session-Id") String sessionId
    ) {
        authService.logout(sessionId);
    }
}
