package com.allinemartins.session.service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    private static final Duration SESSION_TTL = Duration.ofMinutes(30);

    private final StringRedisTemplate redisTemplate;

    public SessionService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String createSession(String username) {
        String sessionId = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                buildKey(sessionId),
                username,
                SESSION_TTL
        );

        return sessionId;
    }

    public Optional<String> getUsername(String sessionId) {
        return Optional.ofNullable(
                redisTemplate.opsForValue().get(buildKey(sessionId))
        );
    }

    public void invalidate(String sessionId) {
        redisTemplate.delete(buildKey(sessionId));
    }

    private String buildKey(String sessionId) {
        return "session:" + sessionId;
    }
}
