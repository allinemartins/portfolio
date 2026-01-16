package om.allinemartins.bookclub.bookclub_api.controller.dto;

import java.time.Instant;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;

public record MemberResponse(
        UUID id,
        UUID clubId,
        String userId,
        String displayName,
        MemberRole role,
        Instant createdAt
) {}
