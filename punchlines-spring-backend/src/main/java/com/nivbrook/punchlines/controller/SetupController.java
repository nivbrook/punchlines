package com.nivbrook.punchlines.controller;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.nivbrook.punchlines.model.Punchline;
import com.nivbrook.punchlines.model.Setup;
import com.nivbrook.punchlines.payload.ApiResponse;
import com.nivbrook.punchlines.payload.PagedResponse;
import com.nivbrook.punchlines.payload.PunchlineRequest;
import com.nivbrook.punchlines.payload.PunchlineResponse;
import com.nivbrook.punchlines.payload.SetupRequest;
import com.nivbrook.punchlines.payload.SetupResponse;
import com.nivbrook.punchlines.security.CurrentUser;
import com.nivbrook.punchlines.security.UserPrincipal;
import com.nivbrook.punchlines.service.SetupService;
import com.nivbrook.punchlines.util.AppConstants;

@RestController
@RequestMapping("/api/setups")
public class SetupController {
	
	@Autowired
	private SetupService setupService;
	
	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> createSetup(@Valid @RequestBody SetupRequest setupRequest){
		Setup setup = setupService.createSetup(setupRequest);
		
		URI location = ServletUriComponentsBuilder
				.fromCurrentRequest().path("/{setupId}")
				.buildAndExpand(setup.getId()).toUri();
		
		return ResponseEntity.created(location)
				.body(new ApiResponse(true, "Setup Created Successfully"));
	}
	
	@GetMapping
	public PagedResponse<SetupResponse> getSetups(@CurrentUser UserPrincipal currentUser,
			@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
		return setupService.getAllSetups(currentUser, page, size);
	}
	
	@PostMapping("/punchlines")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> createPunchline(@Valid @RequestBody PunchlineRequest punchlineRequest) {
		System.out.println("Recieved punchline: "+punchlineRequest.getText());
		Punchline punchline = setupService.createPunchline(punchlineRequest);
		System.out.println("Processed .createPunchline");
		URI location = ServletUriComponentsBuilder
				.fromCurrentRequest().path("/punchlines/{punchlineId}")
				.buildAndExpand(punchline.getId()).toUri();
		
		return ResponseEntity.created(location)
				.body(new ApiResponse(true, "Punchline Created Successfully"));
	}
	
	@GetMapping("/{setupId}")
	@PreAuthorize("hasRole('USER')")
	public SetupResponse getSetupById(@PathVariable("setupId") Long setupId) {
		SetupResponse setupResponse = setupService.getSetupById(setupId);
		System.out.println(setupResponse.getCreatedBy().getUsername());
		return setupResponse;
	}
	
	@GetMapping("/{setupId}/punchlines")
	@PreAuthorize("hasRole('USER')")
	public PagedResponse<PunchlineResponse> getPunchlineBySetupId(@CurrentUser UserPrincipal currentUser,
			@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
			@RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
			@PathVariable("setupId") Long setupId){
		return setupService.getPunchlinesBySetupId(currentUser, page, size, setupId);
	}
}