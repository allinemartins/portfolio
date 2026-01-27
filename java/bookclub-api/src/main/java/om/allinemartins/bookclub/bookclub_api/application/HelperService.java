package om.allinemartins.bookclub.bookclub_api.application;

import java.util.UUID;
import om.allinemartins.bookclub.bookclub_api.domain.Member;
import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;
import om.allinemartins.bookclub.bookclub_api.repository.MemberRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class HelperService {

    private final MemberRepository memberRepository;

    public HelperService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public void requireClubMember(UUID clubId, String userId) {
        boolean isMember = memberRepository.existsByClub_IdAndUserId(clubId, userId);
        if (!isMember) throw new AccessDeniedException("You are not a member of this club");
    }

    public Member requireClubMemberAndGet(UUID clubId, String userId) {
        return memberRepository.findByClub_IdAndUserId(clubId, userId)
                .orElseThrow(() -> new AccessDeniedException("You are not a member of this club"));
    }

    public void requireClubAdmin(UUID clubId, String userId) {
        if (!memberRepository.existsByClub_IdAndUserIdAndRole(clubId, userId, MemberRole.ADMIN)) {
            throw new AccessDeniedException("You are not an admin of this club");
        }
    }

}
