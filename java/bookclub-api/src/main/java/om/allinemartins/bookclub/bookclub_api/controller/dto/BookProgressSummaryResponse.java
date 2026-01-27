package om.allinemartins.bookclub.bookclub_api.controller.dto;

public record BookProgressSummaryResponse(
        boolean hasRated,
        boolean hasFinished,
        long finishedCount,
        long totalMembers
) {}