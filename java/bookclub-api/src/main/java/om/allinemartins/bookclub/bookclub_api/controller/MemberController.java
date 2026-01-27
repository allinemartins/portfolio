package om.allinemartins.bookclub.bookclub_api.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

import om.allinemartins.bookclub.bookclub_api.application.MemberService;
import om.allinemartins.bookclub.bookclub_api.config.security.SecurityHelper;
import om.allinemartins.bookclub.bookclub_api.controller.dto.MemberCreateRequest;
import om.allinemartins.bookclub.bookclub_api.controller.dto.MemberResponse;
import om.allinemartins.bookclub.bookclub_api.controller.dto.MyMembershipResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @PostMapping("/api/clubs/{clubId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MemberResponse> addMember(
            @PathVariable UUID clubId,
            @Valid @RequestBody MemberCreateRequest request
    ) {
        MemberResponse created = service.addMember(clubId, request, SecurityHelper.currentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/api/clubs/{clubId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MemberResponse>> listMembers(
            @PathVariable UUID clubId
    ) {
        return ResponseEntity.ok(service.listMembers(clubId, SecurityHelper.currentUserId()));
    }

    @DeleteMapping("/api/clubs/{clubId}/members/{memberId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID clubId,
            @PathVariable UUID memberId
    ) {
        service.removeMember(clubId, memberId, SecurityHelper.currentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/me/memberships")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MyMembershipResponse>> myMemberships() {
        return ResponseEntity.ok(service.myMemberships(SecurityHelper.currentUserId()));
    }
}
