package om.allinemartins.bookclub.bookclub_api.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookCreateRequest(
        @NotBlank(message = "title is required")
        @Size(max = 200, message = "title must have at most 200 characters")
        String title,

        @NotBlank(message = "author is required")
        @Size(max = 150, message = "author must have at most 150 characters")
        String author,

        @Size(max = 500, message = "imageUrl must have at most 500 characters")
        String imageUrl
) {}