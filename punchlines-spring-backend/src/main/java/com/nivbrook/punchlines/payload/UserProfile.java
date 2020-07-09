package com.nivbrook.punchlines.payload;

import java.time.Instant;

public class UserProfile {
    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private Long setupCount;
    private Long punchlineCount;

    public UserProfile(Long id, String username, String name, Instant joinedAt, Long setupCount, Long punchlineCount) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.setupCount = setupCount;
        this.punchlineCount = punchlineCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Long getSetupCount() {
        return setupCount;
    }

    public void setSetupCount(Long setupCount) {
        this.setupCount = setupCount;
    }

    public Long getPunchlineCount() {
        return punchlineCount;
    }

    public void setPunchlineCount(Long punchlineCount) {
        this.punchlineCount = punchlineCount;
    }
}