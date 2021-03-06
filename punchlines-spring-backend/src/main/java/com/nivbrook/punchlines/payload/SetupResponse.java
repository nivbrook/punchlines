package com.nivbrook.punchlines.payload;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class SetupResponse {
	private Long id;
	private String text;
	private String category;
	private UserSummary createdBy;
	private Instant creationDateTime;
	private int punchlineCount;
	private List<Long> likeIds = new ArrayList<>();
	
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
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public int getPunchlineCount() {
		return punchlineCount;
	}
	public void setPunchlineCount(int punchlineCount) {
		this.punchlineCount = punchlineCount;
	}
	public List<Long> getLikeIds() {
		return likeIds;
	}
	public void setLikeIds(List<Long> likeIds) {
		this.likeIds = likeIds;
	}
}
