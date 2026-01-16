package om.allinemartins.bookclub.bookclub_api.application;

import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.controller.dto.ClubRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.ClubResponse;
import om.allinemartins.bookclub.bookclub_api.domain.Club;
import om.allinemartins.bookclub.bookclub_api.domain.Member;
import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;
import om.allinemartins.bookclub.bookclub_api.repository.ClubRepository;
import om.allinemartins.bookclub.bookclub_api.repository.MemberRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;

    public ClubService(ClubRepository clubRepository, MemberRepository memberRepository) {
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public ClubResponse create(ClubRequest request, String creatorUserId, String creatorDisplayName) {
        Club club = new Club(null, request.name().trim());
        Club savedClub = clubRepository.save(club);

        Member owner = new Member(
                savedClub,
                creatorUserId,
                normalizeDisplayName(creatorDisplayName),
                MemberRole.ADMIN
        );
        memberRepository.save(owner);

        return toResponse(savedClub);
    }

    @Transactional(readOnly = true)
    public List<ClubResponse> list() {
        return clubRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClubResponse getById(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found: " + id));
        return toResponse(club);
    }

    private ClubResponse toResponse(Club club) {
        return new ClubResponse(club.getId(), club.getName());
    }

    private String normalizeDisplayName(String displayName) {
        String value = (displayName == null) ? "" : displayName.trim();
        return value.isBlank() ? "Unknown" : value;
    }
}
