export default function(state = [], action) {
	switch (action.type) {
		case 'ADD_PRODUCT_PRICE':
			return addProductPrice(state, action.payload.price, action.payload.image, action.payload.productName);
		case 'REMOVE_PRODUCT_PRICE':
			return removeProductPrice(state, action.payload);
		case 'INCREMENT_PRODUCT_PRICE_COUNT':
			return incrementProductPriceCount(state, action.payload);
		case 'DECREMENT_PRODUCT_PRICE_COUNT':
			return decrementProductPriceCount(state, action.payload);
		case 'CLEAR_CART':
			return [];
		default: return state; 
	}
}

function addProductPrice(cart, price, image, productName) {
	return cart.concat({ 
		id: price.id,
		productId: price.productId, 
		value: price.value,
		value2: price.value2,
		description: price.description,
		image,
		productName,
		count: 1 
	});
}

function removeProductPrice(cart, id) {
	return cart.filter(p => p.id !== id);
}

function incrementProductPriceCount(cart, id) {
	return cart.reduce((r, p) => { 
		if(p.id === id)
			p.count++;

		r.push(p); 
		return r; 
	}, [])
}

function decrementProductPriceCount(cart, id) {
	return cart.reduce((r, p) => { 
		if(p.id === id)
			if(p.count > 0)
				p.count--;

		r.push(p); 
		return r; 
	}, [])
}