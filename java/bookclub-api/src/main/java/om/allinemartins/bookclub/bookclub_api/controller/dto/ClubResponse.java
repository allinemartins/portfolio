package om.allinemartins.bookclub.bookclub_api.controller.dto;

import java.util.UUID;

public record ClubResponse(
        UUID id,
        String name
) {}
