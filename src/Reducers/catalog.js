function getInitialState() {
    return {
		categories: [],
        products: [],
        foundProducts: [],
        currentCategoryId: null,
        selectedCategories: [],
        currentProductId: undefined,
        currentPriceId: undefined,
        featured: [],
        reviews: [],
        fetching: false,
        fetchingFailed: false,
    }
}

export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CATEGORY_ID':
            return { ...state, currentCategoryId: action.payload };
        case 'FETCH_CATEGORIES_START':
            return { ...state, fetching: true, failedFetching: false };
        case 'FETCH_CATEGORIES_RECEIVED':
            return { 
				...state, 
				categories: action.payload,
				fetching: false, 
				fetchingFailed: false 
			};
        case 'FETCH_CATEGORIES_ERROR':
            return { ...state, fetching: false, failedFetching: true };
        case 'SELECT_CATEGORY':
            const id = action.payload.id;
            if(action.payload.selected)
                return { ...state, selectedCategories: state.selectedCategories.concat(id).filter(i => i !== 0) };
            else
                return { ...state, selectedCategories: state.selectedCategories.filter(i => i !== id) };
        case 'RESET_CATEGORY':
            return { ...state, selectedCategories: [action.payload] };
        case 'SET_PRODUCT_ID':
            return { ...state, currentProductId: action.payload };
       	case 'SET_PRICE_ID':
            return { ...state, currentPriceId: action.payload };
		case 'FETCH_PRODUCTS_START':
            return { ...state, fetching: true, fetchingFailed: false };
        case 'FETCH_PRODUCTS_RECEIVED':
            return {
    			...state,
    			products: action.payload.pageNumber === 0 ? action.payload.products : state.products.concat(action.payload.products),
    			fetching: false,
    			fetchingFailed: false
            };
        case 'FOUND_PRODUCTS_RECEIVED':
            return { 
                ...state, 
                foundProducts: action.payload.pageNumber === 0 ? action.payload.products : state.foundProducts.concat(action.payload.products), 
                fetching: false, 
                fetchingFailed: false 
            };
        case 'FETCH_PRODUCTS_ERROR':
            return { ...state, fetching: false, fetchingFailed: true };
        case 'FETCH_FEATURED_START':
            return state;
        case 'FETCH_FEATURED_ERROR':
            return state;
        case 'FETCH_FEATURED_RECEIVED':
            return { ...state, featured: action.payload };
        case 'FETCH_PRODUCT_REVIEWS_RECEIVED':
            return { ...state, reviews: action.payload }
        default: return state;
    }
}