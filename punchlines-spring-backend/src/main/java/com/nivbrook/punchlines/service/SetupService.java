package com.nivbrook.punchlines.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nivbrook.punchlines.exception.BadRequestException;
import com.nivbrook.punchlines.exception.ResourceNotFoundException;
import com.nivbrook.punchlines.model.Punchline;
import com.nivbrook.punchlines.model.Setup;
import com.nivbrook.punchlines.model.User;
import com.nivbrook.punchlines.payload.PagedResponse;
import com.nivbrook.punchlines.payload.PunchlineRequest;
import com.nivbrook.punchlines.payload.PunchlineResponse;
import com.nivbrook.punchlines.payload.SetupRequest;
import com.nivbrook.punchlines.payload.SetupResponse;
import com.nivbrook.punchlines.repository.PunchlineRepository;
import com.nivbrook.punchlines.repository.SetupRepository;
import com.nivbrook.punchlines.repository.UserRepository;
import com.nivbrook.punchlines.security.UserPrincipal;
import com.nivbrook.punchlines.util.AppConstants;
import com.nivbrook.punchlines.util.ModelMapper;

@Service
public class SetupService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SetupRepository setupRepository;
	
	@Autowired
	private PunchlineRepository punchlineRepository;
	
	private static final Logger logger = LoggerFactory.getLogger(SetupService.class);
	
	public Setup createSetup(SetupRequest setupRequest, UserPrincipal currentUser) {
		Setup setup = new Setup();
		setup.setText(setupRequest.getText());
		setup.setCategory(setupRequest.getCategory());
		Setup savedSetup = setupRepository.save(setup);
		likeSetup(currentUser.getId(), savedSetup.getId());
		return savedSetup;
	}
	
	public Punchline createPunchline(PunchlineRequest punchlineRequest, UserPrincipal currentUser) {
		Punchline punchline = new Punchline();
		punchline.setText(punchlineRequest.getText());
		punchline.setSetup(setupRepository.findById(punchlineRequest.getSetupId()).get());
		Punchline savedPunchline = punchlineRepository.save(punchline);
		likePunchline(currentUser.getId(), savedPunchline.getId());
		return savedPunchline;
	}
	
	public PagedResponse<SetupResponse> getAllSetups(UserPrincipal currentUser, int page, int size, String category, String sort) {
		validatePageNumberAndSize(page, size);
		System.out.println("category="+category+" sort="+sort);
		Pageable pageable;
		if (sort.equals("newest")) {
			pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
		} else {
			pageable = PageRequest.of(page, size, Sort.Direction.DESC, "likeCount");
		}
		Page<Setup> setups;
		if (category.equals("all")) {
			System.out.println("finding all");
			setups = setupRepository.findAll(pageable);
		} else {
			setups = setupRepository.findByCategory(category, pageable);
		}
		
		if(setups.getNumberOfElements()==0) {
			return new PagedResponse<>(Collections.emptyList(), setups.getNumber(),
					setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
		}
		
		Map<Long, User> creatorMap = getSetupCreatorMap(setups.getContent());
		
		List<SetupResponse> setupResponses = setups.map(setup -> {
			return ModelMapper.mapSetupToSetupResponse(setup, creatorMap.get(setup.getCreatedBy()));
		}).getContent();
		
		return new PagedResponse<>(setupResponses, setups.getNumber(), setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
	}
	
	public SetupResponse getSetupById(Long id) {
		Setup setup = setupRepository.findById(id).get();
		User creator = userRepository.findById(setup.getCreatedBy()).get();
		System.out.println(creator.toString());
		return ModelMapper.mapSetupToSetupResponse(setup, creator);
	}
	
	public PagedResponse<PunchlineResponse> getPunchlinesBySetupId(UserPrincipal currentUser, int page, int size, Long setupId, String sort) {
		validatePageNumberAndSize(page, size);
		
		Pageable pageable;
		if (sort.equals("newest")) {
			pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
		} else {
			pageable = PageRequest.of(page, size, Sort.Direction.DESC, "likeCount");
		}
		
		Page<Punchline> punchlines = punchlineRepository.findBySetupId(setupId, pageable);
		
		if(punchlines.getNumberOfElements()==0) {
			return new PagedResponse<>(Collections.emptyList(), punchlines.getNumber(),
					punchlines.getSize(), punchlines.getTotalElements(), punchlines.getTotalPages(), punchlines.isLast());
		}
		
		Map<Long, User> creatorMap = getPunchlineCreatorMap(punchlines.getContent());
		
		List<PunchlineResponse> punchlineResponses = punchlines.map(punchline -> {
			return ModelMapper.mapPunchlineToPunchlineResponse(punchline, creatorMap.get(punchline.getCreatedBy()));
		}).getContent();
		
		return new PagedResponse<>(punchlineResponses, punchlines.getNumber(), punchlines.getSize(), punchlines.getTotalElements(), punchlines.getTotalPages(), punchlines.isLast());
	}
	
    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
    
    Map<Long, User> getSetupCreatorMap(List<Setup> setups){
    	List<Long> creatorIds = setups.stream()
    			.map(Setup::getCreatedBy)
    			.distinct()
    			.collect(Collectors.toList());
    	
    	List<User> creators = userRepository.findByIdIn(creatorIds);
    	Map<Long, User> creatorMap = creators.stream()
    			.collect(Collectors.toMap(User::getId, Function.identity()));
    	
    	return creatorMap;
    }
    
    Map<Long, User> getPunchlineCreatorMap(List<Punchline> punchlines){
    	List<Long> creatorIds = punchlines.stream()
    			.map(Punchline::getCreatedBy)
    			.distinct()
    			.collect(Collectors.toList());
    	
    	List<User> creators = userRepository.findByIdIn(creatorIds);
    	Map<Long, User> creatorMap = creators.stream()
    			.collect(Collectors.toMap(User::getId, Function.identity()));
    	
    	return creatorMap;
    }
    
    public void deleteSetup(Long id) {
    	setupRepository.deleteById(id);
    }
    
    public void deletePunchline(Long id) {
    	punchlineRepository.deleteById(id);
    }
    
    public void likeSetup(Long userId, Long setupId) {
    	Setup setup = setupRepository.findById(setupId).get();
    	User user = userRepository.findById(userId).get();
    	setup.getUserLikes().add(user);
    	setup.setLikeCount(setup.getLikeCount()+1);
    	setupRepository.save(setup);
    }
    
    public void unlikeSetup(Long userId, Long setupId) {
    	Setup setup = setupRepository.findById(setupId).get();
    	User user = userRepository.findById(userId).get();
    	setup.getUserLikes().remove(user);
    	setup.setLikeCount(setup.getLikeCount()-1);
    	setupRepository.save(setup);
    }
    
    public void likePunchline(Long userId, long punchlineId) {
    	Punchline punchline = punchlineRepository.findById(punchlineId).get();
    	User user = userRepository.findById(userId).get();
    	punchline.getUserLikes().add(user);
    	punchline.setLikeCount(punchline.getLikeCount()+1);
    	punchlineRepository.save(punchline);
    }
    
    public void unlikePunchline(Long userId, long punchlineId) {
    	Punchline punchline = punchlineRepository.findById(punchlineId).get();
    	User user = userRepository.findById(userId).get();
    	punchline.getUserLikes().remove(user);
    	punchline.setLikeCount(punchline.getLikeCount()-1);
    	punchlineRepository.save(punchline);
    }
    
    public PagedResponse<SetupResponse> getSetupsCreatedBy(String username, UserPrincipal currentUser, int page, int size, String category, String sort) {
    	validatePageNumberAndSize(page, size);
    	
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(()-> new ResourceNotFoundException("User", "username", username));
    	
    	Pageable pageable;
    	if (sort.equals("newest")) {
    		pageable = PageRequest.of(page,  size, Sort.Direction.DESC, "createdAt");
    	} else {
    		pageable = PageRequest.of(page,  size, Sort.Direction.DESC, "likeCount");
    	}
    	
    	Page<Setup> setups;
    	if(category.equals("all")) {
    		setups = setupRepository.findByCreatedBy(user.getId(), pageable);
    	} else {
    		setups = setupRepository.findByCreatedByAndCategory(user.getId(), category, pageable);
    	}
    	
    	if(setups.getNumberOfElements()==0) {
			return new PagedResponse<>(Collections.emptyList(), setups.getNumber(),
					setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
		}
    	
    	Map<Long, User> creatorMap = getSetupCreatorMap(setups.getContent());
		
		List<SetupResponse> setupResponses = setups.map(setup -> {
			return ModelMapper.mapSetupToSetupResponse(setup, creatorMap.get(setup.getCreatedBy()));
		}).getContent();
		
		return new PagedResponse<>(setupResponses, setups.getNumber(), setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
    }
    
    public PagedResponse<PunchlineResponse> getPunchlinesCreatedBy(String username, UserPrincipal currentUser, int page, int size, String sort) {
    	validatePageNumberAndSize(page, size);
    	
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(()-> new ResourceNotFoundException("User", "username", username));
    	
    	Pageable pageable;
    	if (sort.equals("newest")) {
    		pageable = PageRequest.of(page,  size, Sort.Direction.DESC, "createdAt");
    	} else {
    		pageable = PageRequest.of(page,  size, Sort.Direction.DESC, "likeCount");
    	}
    	
    	Page<Punchline> punchlines = punchlineRepository.findByCreatedBy(user.getId(), pageable);
    	
    	if(punchlines.getNumberOfElements()==0) {
			return new PagedResponse<>(Collections.emptyList(), punchlines.getNumber(),
					punchlines.getSize(), punchlines.getTotalElements(), punchlines.getTotalPages(), punchlines.isLast());
		}
    	
		Map<Long, User> creatorMap = getPunchlineCreatorMap(punchlines.getContent());
		
		List<PunchlineResponse> punchlineResponses = punchlines.map(punchline -> {
			return ModelMapper.mapPunchlineToPunchlineResponse(punchline, creatorMap.get(punchline.getCreatedBy()));
		}).getContent();
		
		return new PagedResponse<>(punchlineResponses, punchlines.getNumber(), punchlines.getSize(), punchlines.getTotalElements(), punchlines.getTotalPages(), punchlines.isLast());
    }
}



































