package com.allinemartins.auth.dto;

public record LoginRequest(
        String username,
        String password
) {}
