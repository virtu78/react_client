function getInitialState() {
	return {
		reviews: [],
		fetching: false,
		fetchingError: false
	}
}

export default function(state = getInitialState(), action) {
	switch (action.type) {
		case 'FETCH_REVIEWS_START':
			return { ...state, fetching: true, fetchingError: false };
		case 'FETCH_REVIEWS_ERROR':
			return { ...state, fetching: false, fetchingError: true };
		case 'FETCH_REVIEWS_RECEIVED':
			return { reviews: action.payload, fetching: false, fetchingError: false };
		default: return state; 
	}
}