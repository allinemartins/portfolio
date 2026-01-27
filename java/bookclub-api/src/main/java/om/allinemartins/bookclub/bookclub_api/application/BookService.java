package om.allinemartins.bookclub.bookclub_api.application;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.controller.dto.BookCreateRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookProgressSummaryResponse;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookResponse;
import om.allinemartins.bookclub.bookclub_api.domain.*;
import om.allinemartins.bookclub.bookclub_api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {

    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final BookProgressRepository progressRepository;
    private final HelperService helperService;
    private static final String RESOURCE_NOT_FOUND = "Book not found: ";

    public BookService(
            ClubRepository clubRepository,
            MemberRepository memberRepository,
            BookRepository bookRepository,
            BookProgressRepository progressRepository,
            HelperService helperService
    ) {
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
        this.bookRepository = bookRepository;
        this.progressRepository = progressRepository;
        this.helperService = helperService;
    }

    @Transactional
    public BookResponse createSuggested(UUID clubId, BookCreateRequest request, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found: " + clubId));

        Book book = new Book(
                club,
                request.title().trim(),
                request.author().trim(),
                request.imageUrl() == null ? null : request.imageUrl().trim()
        );

        Book saved = bookRepository.save(book);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> list(UUID clubId, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        return bookRepository.findByClub_Id(clubId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookResponse startReading(UUID clubId, UUID bookId, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        Book book = bookRepository.findByIdAndClub_Id(bookId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND + bookId));

        if (book.getStatus() != BookStatus.SUGGESTED) {
            throw new IllegalStateException("Only SUGGESTED books can be moved to READING");
        }

        if (bookRepository.existsByClub_IdAndStatus(clubId, BookStatus.READING)) {
            throw new IllegalStateException("There is already a READING book in this club");
        }

        book.setStatus(BookStatus.READING);
        return toResponse(book);
    }

    @Transactional
    public BookResponse finishBook(UUID clubId, UUID bookId, String requesterUserId) {
        Member member = helperService.requireClubMemberAndGet(clubId, requesterUserId);

        Book book = bookRepository.findByIdAndClub_Id(bookId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND + bookId));

        if (book.getStatus() != BookStatus.READING) {
            throw new IllegalStateException("Only READING books can be finished");
        }

        BookProgress progress = progressRepository
                .findByBook_IdAndMember_Id(bookId, member.getId())
                .orElseGet(() -> new BookProgress(book, member));

        progress.markFinished();
        progressRepository.save(progress);

        long finishedCount = progressRepository.countByBook_IdAndFinishedTrue(bookId);
        long totalMembers = memberRepository.findByClub_Id(clubId).size();

        if (totalMembers > 0 && finishedCount == totalMembers) {
            book.setStatus(BookStatus.READ);
        }

        return toResponse(book);
    }

    @Transactional
    public void deleteSuggested(UUID clubId, UUID bookId, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        Book book = bookRepository.findByIdAndClub_Id(bookId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND + bookId));

        if (book.getStatus() != BookStatus.SUGGESTED) {
            throw new IllegalStateException("Only SUGGESTED books can be deleted");
        }

        bookRepository.delete(book);
    }

    @Transactional(readOnly = true)
    public Optional<BookResponse> getCurrentReadingBook(UUID clubId, String requesterUserId) {
        helperService.requireClubMember(clubId, requesterUserId);

        return bookRepository.findByClub_IdAndStatus(clubId, BookStatus.READING)
                .map(this::toResponse);
    }

    @Transactional
    public BookResponse rateBook(UUID clubId, UUID bookId, int rating, String requesterUserId) {
        Member member = helperService.requireClubMemberAndGet(clubId, requesterUserId);

        Book book = bookRepository.findByIdAndClub_Id(bookId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND + bookId));

        BookProgress progress = progressRepository
                .findByBook_IdAndMember_Id(bookId, member.getId())
                .orElseThrow(() -> new IllegalStateException("You must finish the book before rating it"));

        if (!progress.isFinished()) {
            throw new IllegalStateException("You must finish the book before rating it");
        }

        progress.setRating(rating);
        progressRepository.save(progress);

        return toResponse(book);
    }

    @Transactional(readOnly = true)
    public BookProgressSummaryResponse getMyProgressSummary(UUID clubId, UUID bookId, String userId) {

        Book book = bookRepository.findByIdAndClub_Id(bookId, clubId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found in this club"));

        Member member = memberRepository.findByClub_IdAndUserId(clubId, userId)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of this club"));

        BookProgress bp = progressRepository.findByBook_IdAndMember_Id(book.getId(), member.getId())
                .orElse(null);

        boolean hasFinished = bp != null && bp.isFinished();
        boolean hasRated = bp != null && bp.getRating() != null;

        long finishedCount = progressRepository.countByBook_IdAndFinishedTrue(book.getId());
        long totalMembers = memberRepository.countByClub_Id(clubId);

        return new BookProgressSummaryResponse(hasRated, hasFinished, finishedCount, totalMembers);
    }

    private BookResponse toResponse(Book b) {
        Double avg = progressRepository.avgRatingByBookId(b.getId());
        long count = progressRepository.countByBook_IdAndRatingIsNotNull(b.getId());

        return new BookResponse(
                b.getId(),
                b.getClub().getId(),
                b.getTitle(),
                b.getAuthor(),
                b.getImageUrl(),
                b.getStatus(),
                b.getCreatedAt(),
                avg,
                count
        );
    }
}
