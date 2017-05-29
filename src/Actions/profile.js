export function signUp(email, password) {
	return {
		type: 'SIGN_UP',
		payload: {
			email, 
			password
		}
	}
}

export function signIn(email, password) {
	return {
		type: 'SIGN_IN',
		payload: {
			email, 
			password
		}
	}
}

export function loadProfile() {
	return {
		type: 'LOAD_PROFILE'
	}	
}

export function profileReceived(profile) {
	return {
		type: 'PROFILE_RECEIVED',
		payload: profile
	}	
}

export function sendProfile() {
	return {
		type: 'SEND_PROFILE',
		payload: {
			
		}
	}	
}

export function clearProfile() {
	return {
		type: 'CLEAR_PROFILE'
	}
}

export function fetchOrders() {
	return {
		type: 'FETCH_ORDERS'
	}	
}

export function fetchOrdersReceived(orders) {
	return {
		type: 'FETCH_ORDERS_RECEIVED',
		payload: orders
	}	
}

export function setAuthToken(token) {
	return {
		type: 'SET_AUTH_TOKEN',
		payload: token
	}	
}

export function setAuthMessage(message) {
	return {
		type: 'SET_AUTH_MESSAGE',
		payload: message
	}	
}

export function addAddress(description, city, street, house, entrance, floor, flat) {
	return {
		type: 'ADD_ADDRESS',
		payload: {
			description, 
			city, 
			street, 
			house,
            entrance,
			floor,
			flat
		}
	}	
}

export function addAddressSuccess(address) {
	return {
		type: 'ADD_ADDRESS_SUCCESS',
		payload: address
	}	
}

export function editAddress(description, city, street, house, entrance, floor, flat) {//todo пока не требовалось
	return {
		type: 'EDIT_ADDRESS',
		payload: {
			description, 
			city, 
			street, 
			house,
            entrance,
            floor,
			flat
		}
	}	
}

export function deleteAddress(id) {
	return {
		type: 'DELETE_ADDRESS',
		payload: id
	}	
}

export function deleteAddressSuccess(id) {
	return {
		type: 'DELETE_ADDRESS_SUCCESS',
		payload: id
	}	
}

export function setName(name) {
	return {
		type: 'SET_NAME',
		payload: name
	}	
}

export function setPhone(phone) {
	return {
		type: 'SET_PHONE',
		payload: phone
	}	
}

export function setEmail(email) {
	return {
		type: 'SET_EMAIL',
		payload: email
	}	
}

export function setOrderDetailsId(id) {
	return {
		type: 'SET_ORDER_DETAILS_ID',
		payload: id
	}
}

export function fetchOrderDetails(lines) {
	return {
		type: 'FETCH_ORDER_DETAILS',
		payload: lines
	}
}

export function fetchOrderDetailsReceived(products) {
	return {
		type: 'FETCH_ORDER_DETAILS_RECEIVED',
		payload: products
	}
}

export function fetchFavorites(favorites) {
	return {
		type: 'FETCH_FAVORITES',
		payload: favorites
	}
}

export function fetchFavoritesReceived(favorites) {
	return {
		type: 'FETCH_FAVORITES_RECEIVED',
		payload: favorites
	}
}

export function addFavorite(id) {
	return {
		type: 'ADD_FAVORITE',
		payload: id
	}
}

export function addFavoriteSuccess(id) {
	return {
		type: 'ADD_FAVORITE_SUCCESS',
		payload: id
	}
}

export function removeFavorite(id) {
	return {
		type: 'REMOVE_FAVORITE',
		payload: id
	}
}

export function removeFavoriteSuccess(id) {
	return {
		type: 'REMOVE_FAVORITE_SUCCESS',
		payload: id
	}
}

export function changeAvatar(id, url) {
	return {
		type: 'CHANGE_AVATAR',
		payload: {
			id, url
		}
	}
}

export function resetPassword(email) {
	return {
		type: 'RESET_PASSWORD',
		payload: email
	}
}

export function changePassword(password) {
	return {
		type: 'CHANGE_PASSWORD',
		payload: password
	}
}