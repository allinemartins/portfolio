package om.allinemartins.bookclub.bookclub_api.controller.dto;

import java.util.UUID;
import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;

public record MyMembershipResponse(
        UUID clubId,
        String clubName,
        MemberRole role
) {}
