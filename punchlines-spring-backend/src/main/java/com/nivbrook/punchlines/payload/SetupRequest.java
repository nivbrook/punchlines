package com.nivbrook.punchlines.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SetupRequest {
	@NotBlank
    @Size(max = 280)
    private String text;
	
	@NotBlank
	private String category;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
}
