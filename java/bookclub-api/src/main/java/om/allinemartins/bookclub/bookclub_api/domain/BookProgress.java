package om.allinemartins.bookclub.bookclub_api.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "book_progress",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_book_progress_member", columnNames = {"book_id", "member_id"})
        }
)
public class BookProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private boolean finished;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "rated_at")
    private Instant ratedAt;

    protected BookProgress() {}

    public BookProgress(Book book, Member member) {
        this.book = book;
        this.member = member;
        this.finished = false;
    }

    public UUID getId() { return id; }
    public Book getBook() { return book; }
    public Member getMember() { return member; }
    public boolean isFinished() { return finished; }
    public Instant getFinishedAt() { return finishedAt; }
    public Integer getRating() { return rating; }
    public Instant getRatedAt() { return ratedAt; }

    public void markFinished() {
        if (!this.finished) {
            this.finished = true;
            this.finishedAt = Instant.now();
        }
    }

    public void setRating(Integer rating) {
        this.rating = rating;
        this.ratedAt = Instant.now();
    }
}
