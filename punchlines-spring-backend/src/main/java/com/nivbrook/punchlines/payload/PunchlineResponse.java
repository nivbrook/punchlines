package com.nivbrook.punchlines.payload;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class PunchlineResponse {
	private Long id;
	private String text;
	private UserSummary createdBy;
	private Instant creationDateTime;
	private List<Long> likeIds = new ArrayList<>();
	private SetupResponse setup;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public UserSummary getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(UserSummary createdBy) {
		this.createdBy = createdBy;
	}
	public Instant getCreationDateTime() {
		return creationDateTime;
	}
	public void setCreationDateTime(Instant creationDateTime) {
		this.creationDateTime = creationDateTime;
	}
	public List<Long> getLikeIds() {
		return likeIds;
	}
	public void setLikeIds(List<Long> likeIds) {
		this.likeIds = likeIds;
	}
	public SetupResponse getSetup() {
		return setup;
	}
	public void setSetup(SetupResponse setup) {
		this.setup = setup;
	}
}
