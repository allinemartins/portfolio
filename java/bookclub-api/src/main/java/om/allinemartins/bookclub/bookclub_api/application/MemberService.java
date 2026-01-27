package om.allinemartins.bookclub.bookclub_api.application;

import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.controller.dto.MemberCreateRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.MemberResponse;
import om.allinemartins.bookclub.bookclub_api.controller.dto.MyMembershipResponse;
import om.allinemartins.bookclub.bookclub_api.domain.Club;
import om.allinemartins.bookclub.bookclub_api.domain.Member;
import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;
import om.allinemartins.bookclub.bookclub_api.repository.ClubRepository;
import om.allinemartins.bookclub.bookclub_api.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final ClubRepository clubRepository;
    private final HelperService helperService;

    public MemberService(MemberRepository memberRepository, ClubRepository clubRepository, HelperService helperService) {
        this.memberRepository = memberRepository;
        this.clubRepository = clubRepository;
        this.helperService = helperService;
    }

    @Transactional
    public MemberResponse addMember(UUID clubId, MemberCreateRequest request, String requesterUserId) {
        helperService.requireClubAdmin(clubId, requesterUserId);

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found: " + clubId));

        if (memberRepository.existsByClub_IdAndUserId(clubId, request.userId())) {
            throw new IllegalStateException("User already is a member of this club");
        }

        Member member = new Member(
                club,
                request.userId().trim(),
                request.displayName().trim(),
                MemberRole.MEMBER
        );

        Member saved = memberRepository.save(member);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> listMembers(UUID clubId, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        return memberRepository.findByClub_Id(clubId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void removeMember(UUID clubId, UUID memberId, String requesterUserId) {
        helperService.requireClubAdmin(clubId, requesterUserId);

        Member member = memberRepository.findByIdAndClub_Id(memberId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + memberId));

        memberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public List<MyMembershipResponse> myMemberships(String requesterUserId) {
        return memberRepository.findByUserId(requesterUserId).stream()
                .map(m -> new MyMembershipResponse(
                        m.getClub().getId(),
                        m.getClub().getName(),
                        m.getRole()
                ))
                .toList();
    }

    private MemberResponse toResponse(Member m) {
        return new MemberResponse(
                m.getId(),
                m.getClub().getId(),
                m.getUserId(),
                m.getDisplayName(),
                m.getRole(),
                m.getCreatedAt()
        );
    }
}
