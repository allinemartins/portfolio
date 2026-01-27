package om.allinemartins.bookclub.bookclub_api.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.application.BookService;
import om.allinemartins.bookclub.bookclub_api.config.security.SecurityHelper;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookCreateRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookProgressSummaryResponse;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookRatingRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs/{clubId}/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> createSuggested(
            @PathVariable UUID clubId,
            @Valid @RequestBody BookCreateRequest request
    ) {
        BookResponse created = service.createSuggested(clubId, request, SecurityHelper.currentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookResponse>> list(
            @PathVariable UUID clubId
    ) {
        return ResponseEntity.ok(service.list(clubId, SecurityHelper.currentUserId()));
    }

    @PostMapping("/{bookId}/start-reading")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> startReading(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId
    ) {
        return ResponseEntity.ok(service.startReading(clubId, bookId, SecurityHelper.currentUserId()));
    }

    @PostMapping("/{bookId}/finish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> finish(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId
    ) {
        return ResponseEntity.ok(service.finishBook(clubId, bookId, SecurityHelper.currentUserId()));
    }

    @DeleteMapping("/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId
    ) {
        service.deleteSuggested(clubId, bookId, SecurityHelper.currentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> getCurrentReadingBook(
            @PathVariable UUID clubId
    ) {
        return service.getCurrentReadingBook(clubId, SecurityHelper.currentUserId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{bookId}/rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> rate(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId,
            @Valid @RequestBody BookRatingRequest request
    ) {
        return ResponseEntity.ok(
                service.rateBook(clubId, bookId, request.rating(), SecurityHelper.currentUserId())
        );
    }

    @GetMapping("/{bookId}/progress-summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookProgressSummaryResponse> progressSummary(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId
    ) {
        return ResponseEntity.ok(service.getMyProgressSummary(clubId, bookId, SecurityHelper.currentUserId()));
    }

}
