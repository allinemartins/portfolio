package om.allinemartins.bookclub.bookclub_api.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "club")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    public Club() {}

    public Club(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public UUID getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
