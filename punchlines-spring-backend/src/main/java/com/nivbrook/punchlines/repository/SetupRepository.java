package com.nivbrook.punchlines.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nivbrook.punchlines.model.Setup;

@Repository
public interface SetupRepository extends JpaRepository<Setup, Long>{
	
    Optional<Setup> findById(Long setupId);
    
    long countByCreatedBy(Long userId);
    
    Page<Setup> findByCreatedBy(Long userId, Pageable pageable);
    
    Page<Setup> findByCategory(String category, Pageable pageable);
    
    Page<Setup> findByCreatedByAndCategory(Long userId, String category, Pageable pageable);
    
}
