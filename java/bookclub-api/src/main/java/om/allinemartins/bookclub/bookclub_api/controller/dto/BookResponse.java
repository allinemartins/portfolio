package om.allinemartins.bookclub.bookclub_api.controller.dto;

import java.time.Instant;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.domain.BookStatus;

public record BookResponse(
        UUID id,
        UUID clubId,
        String title,
        String author,
        String imageUrl,
        BookStatus status,
        Instant createdAt,
        Double avgRating,
        Long ratingsCount
) {}
