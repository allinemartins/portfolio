package om.allinemartins.bookclub.bookclub_api.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.application.ClubService;
import om.allinemartins.bookclub.bookclub_api.controller.dto.ClubRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.ClubResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService service;

    public ClubController(ClubService service) {
        this.service = service;
    }

    // ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponse> create(
            @Valid @RequestBody ClubRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String creatorUserId = jwt.getSubject();
        String creatorDisplayName = jwt.getClaimAsString("name"); // geralmente vem do Keycloak
        ClubResponse created = service.create(request, creatorUserId, creatorDisplayName);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // USER or ADMIN
    @GetMapping
    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    public ResponseEntity<List<ClubResponse>> list() {
        return ResponseEntity.ok(service.list());
    }

    // USER or ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    public ResponseEntity<ClubResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }
}
