package om.allinemartins.bookclub.bookclub_api.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.application.BookService;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookCreateRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookRatingRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.BookResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
            @Valid @RequestBody BookCreateRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        BookResponse created = service.createSuggested(clubId, request, jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookResponse>> list(
            @PathVariable UUID clubId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(service.list(clubId, jwt.getSubject()));
    }

    @PostMapping("/{bookId}/start-reading")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> startReading(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(service.startReading(clubId, bookId, jwt.getSubject()));
    }

    @PostMapping("/{bookId}/finish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> finish(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(service.finishBook(clubId, bookId, jwt.getSubject()));
    }

    @DeleteMapping("/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        service.deleteSuggested(clubId, bookId, jwt.getSubject());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> getCurrentReadingBook(
            @PathVariable UUID clubId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return service.getCurrentReadingBook(clubId, jwt.getSubject())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{bookId}/rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookResponse> rate(
            @PathVariable UUID clubId,
            @PathVariable UUID bookId,
            @Valid @RequestBody BookRatingRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(
                service.rateBook(clubId, bookId, request.rating(), jwt.getSubject())
        );
    }

}
