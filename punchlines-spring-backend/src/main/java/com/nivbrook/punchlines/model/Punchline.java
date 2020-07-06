package com.nivbrook.punchlines.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.nivbrook.punchlines.model.audit.UserDateAudit;

@Entity
@Table(name = "punchlines")
public class Punchline extends UserDateAudit{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 280)
    private String text;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "setup_id", nullable = false)
    private Setup setup;
    
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable( name = "user_punchline_votes",
				joinColumns = @JoinColumn(name = "punchline_id"),
				inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> userLikes = new HashSet<>();
    
    public Punchline() {
    	super();
    }
    
    public Punchline(String text) {
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

	public Setup getSetup() {
		return setup;
	}

	public void setSetup(Setup setup) {
		this.setup = setup;
	}

	public Set<User> getUserLikes() {
		return userLikes;
	}

	public void setUserLikes(Set<User> userLikes) {
		this.userLikes = userLikes;
	}
    
}
