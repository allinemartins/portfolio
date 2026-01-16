package om.allinemartins.bookclub.bookclub_api.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "member",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_member_club_user", columnNames = {"club_id", "user_id"})
        }
)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(name = "user_id", nullable = false, length = 80)
    private String userId; // sub do Keycloak

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MemberRole role;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Member() {}

    public Member(Club club, String userId, String displayName, MemberRole role) {
        this.club = club;
        this.userId = userId;
        this.displayName = displayName;
        this.role = role;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Club getClub() { return club; }
    public String getUserId() { return userId; }
    public String getDisplayName() { return displayName; }
    public MemberRole getRole() { return role; }
    public Instant getCreatedAt() { return createdAt; }

    public void setRole(MemberRole role) { this.role = role; }
}