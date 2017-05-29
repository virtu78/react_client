export function getCartPriceCount(cart, priceId) {
	const price = cart.find(p => p.id === priceId);

	if(typeof price !== 'undefined')
		return price.count;

	return 0;
}

export function getSum(cart) {
	return cart.reduce((r, p) => { 
		if(p.value2 === 0)
			return r + p.count * p.value;
		return r + p.count * p.value2; 
	}, 0);
}