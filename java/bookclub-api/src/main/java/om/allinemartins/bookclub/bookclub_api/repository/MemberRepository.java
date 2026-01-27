package om.allinemartins.bookclub.bookclub_api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.domain.Member;
import om.allinemartins.bookclub.bookclub_api.domain.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, UUID> {

    boolean existsByClub_IdAndUserId(UUID clubId, String userId);

    boolean existsByClub_IdAndUserIdAndRole(UUID clubId, String userId, MemberRole role);

    List<Member> findByClub_Id(UUID clubId);

    Optional<Member> findByClub_IdAndUserId(UUID clubId, String userId);

    Optional<Member> findByIdAndClub_Id(UUID memberId, UUID clubId);

    List<Member> findByUserId(String userId);

    long countByClub_Id(UUID clubId);

}
