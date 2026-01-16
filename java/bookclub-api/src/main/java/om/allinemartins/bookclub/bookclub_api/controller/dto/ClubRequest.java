package om.allinemartins.bookclub.bookclub_api.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClubRequest(
    @NotBlank(message = "name is required")
    @Size(max = 150, message = "name must have at most 150 characters")
    String name
) {}
