package om.allinemartins.bookclub.bookclub_api.controller.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BookRatingRequest(
        @NotNull(message = "rating is required")
        @Min(value = 1, message = "rating must be between 1 and 5")
        @Max(value = 5, message = "rating must be between 1 and 5")
        Integer rating
) {}
