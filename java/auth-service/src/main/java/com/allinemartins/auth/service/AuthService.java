package com.allinemartins.auth.service;

import com.allinemartins.session.service.SessionService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final SessionService sessionService;

    public AuthService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    public String login(String username, String password) {

        // Fake credentials
        if (!"admin".equals(username) || !"admin123".equals(password)) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return sessionService.createSession(username);
    }

    public String getCurrentUser(String sessionId) {
        return sessionService.getUsername(sessionId)
                .orElseThrow(() -> new IllegalStateException("Session not found"));
    }

    public void logout(String sessionId) {
        sessionService.invalidate(sessionId);
    }
}
