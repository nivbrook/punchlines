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
import com.nivbrook.punchlines.model.Punchline;
import com.nivbrook.punchlines.model.Setup;
import com.nivbrook.punchlines.model.User;
import com.nivbrook.punchlines.payload.PagedResponse;
import com.nivbrook.punchlines.payload.PunchlineRequest;
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
	
	public Setup createSetup(SetupRequest setupRequest) {
		Setup setup = new Setup();
		setup.setText(setupRequest.getText());
		setup.setCategory(setupRequest.getCategory());
		return setupRepository.save(setup);
	}
	
	public Punchline createPunchline(PunchlineRequest punchlineRequest) {
		System.out.println("Got to createPunchline");
		Punchline punchline = new Punchline();
		punchline.setText(punchlineRequest.getText());
		punchline.setSetup(setupRepository.findById(punchlineRequest.getSetupId()).get());
		return punchlineRepository.save(punchline);
	}
	
	public PagedResponse<SetupResponse> getAllSetups(UserPrincipal currentUser, int page, int size) {
		validatePageNumberAndSize(page, size);
		
		Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
		Page<Setup> setups = setupRepository.findAll(pageable);
		
		if(setups.getNumberOfElements()==0) {
			return new PagedResponse<>(Collections.emptyList(), setups.getNumber(),
					setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
		}
		
		List<Long> setupIds = setups.map(Setup::getId).getContent();
		Map<Long, User> creatorMap = getSetupCreatorMap(setups.getContent());
		
		List<SetupResponse> setupResponses = setups.map(setup -> {
			return ModelMapper.mapSetupToSetupResponse(setup, creatorMap.get(setup.getCreatedBy()));
		}).getContent();
		
		return new PagedResponse<>(setupResponses, setups.getNumber(), setups.getSize(), setups.getTotalElements(), setups.getTotalPages(), setups.isLast());
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
}
