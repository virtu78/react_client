function getInitialState() {
	return {
        comment: undefined,
        useCash: true,
        address: undefined,
		additionalFields: [],
		maxBonusSum: 0,
		discounts: undefined,
		coupon: undefined
	}
}

export default function(state = getInitialState(), action) {
	switch (action.type) {
		case 'FETCH_ADDITIONAL_FIELDS_RECEIVED':
			return { ...state, additionalFields: action.payload };
		case 'GET_MAX_BONUS_SUM_RECEIVED':
			return { ...state, maxBonusSum: action.payload };
		case 'GET_COUPON_DISCOUNT_SUM_RECEIVED':
			return { ...state, discounts: action.payload };
		case 'SET_COUPON':
			return { ...state, coupon: action.payload };
        case 'SET_COMMENT':
            return { ...state, comment: action.payload };
        case 'SET_PAY_TYPE':
            return { ...state, useCash: action.payload };
        case 'SET_ADDRESS':
            return { ...state, address: action.payload };
		case 'CLEAR_DISCOUNTS': {
			return { ...getInitialState(), additionalFields: state.additionalFields }
		}
		default: return state;
	}
}