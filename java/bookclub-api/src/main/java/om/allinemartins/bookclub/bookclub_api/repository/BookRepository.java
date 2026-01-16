package om.allinemartins.bookclub.bookclub_api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.domain.Book;
import om.allinemartins.bookclub.bookclub_api.domain.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, UUID> {

    List<Book> findByClub_Id(UUID clubId);

    Optional<Book> findByIdAndClub_Id(UUID id, UUID clubId);

    boolean existsByClub_IdAndStatus(UUID clubId, BookStatus status);

    Optional<Book> findByClub_IdAndStatus(UUID clubId, BookStatus status);
}
