export default function(state = {}, action) {
	switch (action.type) {
		case 'FETCH_SETTINGS_RECEIVED':
			return { ...action.payload };
		default: return state; 
	}
}