package om.allinemartins.bookclub.bookclub_api.repository;

import java.util.UUID;
import om.allinemartins.bookclub.bookclub_api.domain.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, UUID> {

}
