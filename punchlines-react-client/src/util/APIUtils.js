import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function createSetup(setupData) {
    return request({
        url: API_BASE_URL + "/setups",
        method: 'POST',
        body: JSON.stringify(setupData)
    })
}

export function createPunchline(punchlineData) {
    return request({
        url: API_BASE_URL+"/setups/punchlines",
        method: 'POST',
        body: JSON.stringify(punchlineData)
    })
}

export function getAllSetups(page, size, category="all", sort="newest") {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/setups?page=" + page + "&size=" + size + "&category=" + category + "&sort=" + sort,
        method: 'GET'
    });
}

export function getSetupById(setupId) {
    return request({
        url: API_BASE_URL+"/setups/"+setupId,
        method: 'GET'
    });
}

export function getPunchlinesBySetupId(page, size, setupId, sort) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/setups/"+setupId+"/punchlines?page=" + page + "&size=" + size + "&sort=" + sort,
        method: 'GET'
    });
}

export function deleteSetup(setupId) {
    return request({
        url: API_BASE_URL + "/setups/"+setupId,
        method: 'DELETE'
    })
}

export function deletePunchline(punchlineId) {
    return request({
        url: API_BASE_URL + "/setups/punchlines/"+punchlineId,
        method: 'DELETE'
    })
}

export function likeSetup(setupId) {
    return request({
        url: API_BASE_URL + "/setups/" + setupId + "/like",
        method: 'POST'
    })
}

export function unlikeSetup(setupId) {
    return request({
        url: API_BASE_URL + "/setups/" + setupId + "/unlike",
        method: 'POST'
    })
}

export function likePunchline(punchlineId) {
    return request({
        url: API_BASE_URL + "/setups/punchlines/" + punchlineId + "/like",
        method: 'POST'
    })
}

export function unlikePunchline(punchlineId) {
    return request({
        url: API_BASE_URL + "/setups/punchlines/" + punchlineId + "/unlike",
        method: 'POST'
    })
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserCreatedSetups(username, page, size, category, sort) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/setups/user/" + username + "/setups?page=" + page + "&size=" + size  + "&category=" + category + "&sort=" + sort,
        method: 'GET'
    });
}

export function getUserCreatedPunchlines(username, page, size, sort) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/setups/user/" + username + "/punchlines?page=" + page + "&size=" + size + "&sort="+sort,
        method: 'GET'
    });
}