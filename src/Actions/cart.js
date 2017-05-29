export function addProductPrice(price, image, productName) {
	return {
		type: 'ADD_PRODUCT_PRICE',
		payload: { 
			price,
			image,
			productName
		}
	}
}

export function removeProductPrice(id) {
	return {
		type: 'REMOVE_PRODUCT_PRICE',
		payload: id
	}
}

export function incrementProductPriceCount(id) {
	return {
		type: 'INCREMENT_PRODUCT_PRICE_COUNT',
		payload: id
	}
}

export function decrementProductPriceCount(id) {
	return {
		type: 'DECREMENT_PRODUCT_PRICE_COUNT',
		payload: id
	}
}

export function clearCart() {
	return {
		type: 'CLEAR_CART'
	}
}