package com.nivbrook.punchlines.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nivbrook.punchlines.model.Punchline;

@Repository
public interface PunchlineRepository extends JpaRepository<Punchline, Long>{
	public Page<Punchline> findBySetupId(Long id, Pageable pageable);
	
	long countByCreatedBy(Long userId);
	
    Page<Punchline> findByCreatedBy(Long userId, Pageable pageable);
}
