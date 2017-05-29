export function minPriceValue(product) {
	if(product.prices.length === 0)
		return;

	const result = product.prices.reduce((r, p) => { 
		if(p.value2 !== 0)
			return p.value2 < r.minValue ? { minValue: p.value2, price: p } : r;
		return p.value < r.minValue ? { minValue: p.value, price: p } : r;
	}, { minValue: Number.MAX_VALUE, price: {} });

	return result.price;
}