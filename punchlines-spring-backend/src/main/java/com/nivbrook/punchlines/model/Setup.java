package com.nivbrook.punchlines.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.nivbrook.punchlines.model.audit.UserDateAudit;

@Entity
@Table(name = "setups")
public class Setup extends UserDateAudit{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@NotBlank
	@Size(max = 280)
	private String text;
	
	@NotBlank
	private String category;
	
	@OneToMany(mappedBy = "setup",
			   cascade = CascadeType.ALL,
			   fetch = FetchType.EAGER,
			   orphanRemoval = true)
	@Fetch(FetchMode.SELECT)
	private List<Punchline> punchlines = new ArrayList<>();
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable( name = "user_setup_votes",
				joinColumns = @JoinColumn(name = "setup_id"),
				inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> userLikes = new HashSet<>();
	
	private int likeCount = 0;
		
	public Setup() {
		super();
	}

	public Setup(String text) {
		super();
		this.text = text;
	}

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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public List<Punchline> getPunchlines() {
		return punchlines;
	}

	public void setPunchlines(List<Punchline> punchlines) {
		this.punchlines = punchlines;
	}

	public Set<User> getUserLikes() {
		return userLikes;
	}

	public void setUserLikes(Set<User> userLikes) {
		this.userLikes = userLikes;
	}

	public int getLikeCount() {
		return likeCount;
	}

	public void setLikeCount(int likeCount) {
		this.likeCount = likeCount;
	}
	
}
