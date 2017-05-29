function getInitialState() {
	return {
		id: undefined,
		authToken: undefined,
		name: undefined,
		email: undefined,
		phone: undefined,
		avatarImageId: undefined,
		avatarImagePath: undefined,
		addresses: [],
		orders: [],
		message: undefined,
		orderDetailsId: undefined,
		orderDetails: [],
		favoritesIds: [],
		favorites: [],
		bonusSums: undefined
	}
}

export default function(state = getInitialState(), action) {
	switch(action.type) {
		case 'SET_AUTH_TOKEN':
			return { ...state, authToken: action.payload };
		case 'SET_AUTH_MESSAGE':
			return { ...state, message: action.payload };
		case 'PROFILE_RECEIVED':
			return { 
				...state, 
				id: action.payload.id,
				name: action.payload.name, 
				email: action.payload.email,
				phone: action.payload.phone,
				avatarImageId: action.payload.avatarImageId,
				avatarImagePath: action.payload.avatarImagePath,
				addresses: action.payload.addresses || [],
				favoritesIds: action.payload.favoritesIds || [],
				bonusSums: action.payload.bonusSums
			};
		case 'CLEAR_PROFILE':
			return getInitialState();
		case 'ADD_ADDRESS_SUCCESS':
			return { ...state, addresses: state.addresses.concat({ ...action.payload }) };
		case 'DELETE_ADDRESS_SUCCESS':
			return { ...state, addresses: state.addresses.filter(a => a.id !== action.payload) };
		case 'SET_NAME':
			return { ...state, name: action.payload };
		case 'SET_PHONE':
			return { ...state, phone: action.payload };
		case 'SET_EMAIL':
			return { ...state, email: action.payload };
		case 'FETCH_ORDERS_RECEIVED':
			return { ...state, orders: action.payload };
		case 'FETCH_ORDER_DETAILS_RECEIVED':
			return { ...state, orderDetails: action.payload };
		case 'SET_ORDER_DETAILS_ID':
			return { ...state, orderDetailsId: action.payload };
		case 'FETCH_FAVORITES_RECEIVED':
			return { ...state, favorites: action.payload };
		case 'ADD_FAVORITE_SUCCESS':
			return { ...state, favoritesIds: state.favoritesIds.concat(action.payload) };
		case 'REMOVE_FAVORITE_SUCCESS':
			return { ...state, favoritesIds: state.favoritesIds.filter(f => f !== action.payload) };
		case 'CHANGE_AVATAR':
			return { ...state, avatarImageId: action.payload.id, avatarImagePath: action.payload.url };
		default: return state;
	}
}