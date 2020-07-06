package com.nivbrook.punchlines.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PunchlineRequest {
	@NotBlank
	@Size(max = 280)
	private String text;
	
	private Long setupId;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Long getSetupId() {
		return setupId;
	}

	public void setSetupId(Long setupId) {
		this.setupId = setupId;
	}
	
	
}
