package om.allinemartins.bookclub.bookclub_api.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberCreateRequest(
        @NotBlank(message = "userId is required")
        @Size(max = 80, message = "userId must have at most 80 characters")
        String userId,

        @NotBlank(message = "displayName is required")
        @Size(max = 150, message = "displayName must have at most 150 characters")
        String displayName
) {}
