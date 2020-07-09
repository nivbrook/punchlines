package com.nivbrook.punchlines.util;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.nivbrook.punchlines.model.Poll;
import com.nivbrook.punchlines.model.Punchline;
import com.nivbrook.punchlines.model.Setup;
import com.nivbrook.punchlines.model.User;
import com.nivbrook.punchlines.payload.ChoiceResponse;
import com.nivbrook.punchlines.payload.PollResponse;
import com.nivbrook.punchlines.payload.PunchlineResponse;
import com.nivbrook.punchlines.payload.SetupResponse;
import com.nivbrook.punchlines.payload.UserSummary;

public class ModelMapper {

    public static PollResponse mapPollToPollResponse(Poll poll, Map<Long, Long> choiceVotesMap, User creator, Long userVote) {
        PollResponse pollResponse = new PollResponse();
        pollResponse.setId(poll.getId());
        pollResponse.setQuestion(poll.getQuestion());
        pollResponse.setCreationDateTime(poll.getCreatedAt());
        pollResponse.setExpirationDateTime(poll.getExpirationDateTime());
        Instant now = Instant.now();
        pollResponse.setExpired(poll.getExpirationDateTime().isBefore(now));

        List<ChoiceResponse> choiceResponses = poll.getChoices().stream().map(choice -> {
            ChoiceResponse choiceResponse = new ChoiceResponse();
            choiceResponse.setId(choice.getId());
            choiceResponse.setText(choice.getText());

            if(choiceVotesMap.containsKey(choice.getId())) {
                choiceResponse.setVoteCount(choiceVotesMap.get(choice.getId()));
            } else {
                choiceResponse.setVoteCount(0);
            }
            return choiceResponse;
        }).collect(Collectors.toList());

        pollResponse.setChoices(choiceResponses);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        pollResponse.setCreatedBy(creatorSummary);

        if(userVote != null) {
            pollResponse.setSelectedChoice(userVote);
        }

        long totalVotes = pollResponse.getChoices().stream().mapToLong(ChoiceResponse::getVoteCount).sum();
        pollResponse.setTotalVotes(totalVotes);

        return pollResponse;
    }
    
    public static SetupResponse mapSetupToSetupResponse(Setup setup, User creator) {
    	SetupResponse setupResponse = new SetupResponse();
    	setupResponse.setId(setup.getId());
    	setupResponse.setText(setup.getText());
    	setupResponse.setCategory(setup.getCategory());
    	setupResponse.setCreationDateTime(setup.getCreatedAt());
    	setupResponse.setPunchlineCount(setup.getPunchlines().size());
    	
    	UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
    	setupResponse.setCreatedBy(creatorSummary);
    	
    	for(User user:setup.getUserLikes()) {
    		setupResponse.getLikeIds().add(user.getId());
    	}
    	
    	return setupResponse;
    }
    
    public static PunchlineResponse mapPunchlineToPunchlineResponse(Punchline punchline, User creator) {
    	PunchlineResponse punchlineResponse = new PunchlineResponse();
    	punchlineResponse.setId(punchline.getId());
    	punchlineResponse.setText(punchline.getText());
    	punchlineResponse.setCreationDateTime(punchline.getCreatedAt());
    	
    	SetupResponse setupResponse = mapSetupToSetupResponse(punchline.getSetup(), creator);
    	punchlineResponse.setSetup(setupResponse);
    	
    	UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
    	punchlineResponse.setCreatedBy(creatorSummary);
    	
    	for(User user:punchline.getUserLikes()) {
    		punchlineResponse.getLikeIds().add(user.getId());
    	}
    	
    	return punchlineResponse;
    }
}