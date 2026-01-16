package om.allinemartins.bookclub.bookclub_api.repository;

import java.util.Optional;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.domain.BookProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookProgressRepository extends JpaRepository<BookProgress, UUID> {

    long countByBook_IdAndFinishedTrue(UUID bookId);

    Optional<BookProgress> findByBook_IdAndMember_Id(UUID bookId, UUID memberId);

    long countByBook_IdAndRatingIsNotNull(UUID bookId);

    @Query("""
        select avg(bp.rating)
        from BookProgress bp
        where bp.book.id = :bookId
          and bp.rating is not null
    """)
    Double avgRatingByBookId(@Param("bookId") UUID bookId);
}
