package om.allinemartins.bookclub.bookclub_api.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 150)
    private String author;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Book() {}

    public Book(Club club, String title, String author, String imageUrl) {
        this.club = club;
        this.title = title;
        this.author = author;
        this.imageUrl = imageUrl;
        this.status = BookStatus.SUGGESTED;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Club getClub() { return club; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getImageUrl() { return imageUrl; }
    public BookStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setStatus(BookStatus status) { this.status = status; }
}
