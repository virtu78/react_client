import axios from 'axios';

import { HOST, PRODUCTS_PER_PAGE } from '../utils/constants';
import {getHeader} from "../utils/common";

//Categories

export function setCategoryId(id) {
    return {
        type: 'SET_CATEGORY_ID',
        payload: id
    }
}

export function fetchCategories() {
    return (dispatch, getState) => {
        dispatch(fetchCategoriesStart());

        const state = getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/categories`, {
            startCategoryId: null,
            withChildren: true
        }, { headers })
            .then(res => dispatch(fetchCategoriesReceived(res.data)))
            .catch(err => dispatch(fetchCategoriesError()));

    }
}

export function fetchCategoriesStart() {
    return {
        type: 'FETCH_CATEGORIES_START'
    }
}

export function fetchCategoriesReceived(categories) {
    return {
        type: 'FETCH_CATEGORIES_RECEIVED',
        payload: categories.sort((a, b) => a.sortOrder - b.sortOrder)
    }
}

export function fetchCategoriesError() {
    return {
        type: 'FETCH_CATEGORIES_ERROR'
    }
}

export function selectCategory(id, selected) {
    return {
        type: 'SELECT_CATEGORY',
        payload: {
            id,
            selected
        }
    }
}

export function resetCategory(id) {
    return {
        type: 'RESET_CATEGORY',
        payload: id
    }
}

//Products

export function setProductId(id) {
    return {
        type: 'SET_PRODUCT_ID',
        payload: id
    }
}

export function fetchProducts(parentCategoryIds, searchOpts) {
    return (dispatch, getState) => {
        const callback = searchOpts.done;
        delete searchOpts.done;

        dispatch(fetchProductsStart());

        const state = getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        if(parentCategoryIds[0] === null)
            parentCategoryIds = null;

        axios.post(`${HOST}/api/catalog/products`, {
            categoryId: parentCategoryIds,
            ...searchOpts,
            pageSize: PRODUCTS_PER_PAGE
        }, { headers })
            .then(res => {
                dispatch(fetchProductsReceived(res.data, searchOpts.pageNumber));

                if(callback)
                    callback();
            })
            .catch(err => dispatch(fetchProductsError()));
    }
}

export function searchProducts(parentCategoryId, searchOpts) {
    return (dispatch, getState) => {//todo в отдельную функцию
        const callback = searchOpts.done;
        delete searchOpts.done;

        const state = getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/products`, {
            categoryId: [parentCategoryId],
            ...searchOpts,
            pageSize: PRODUCTS_PER_PAGE
        }, { headers })
            .then(res => {
                dispatch(foundProductsReceived(res.data, searchOpts.pageNumber));

                if(callback)
                    callback();
            });
    }
}

export function fetchProductsStart() {
    return {
        type: 'FETCH_PRODUCTS_START'
    }
}

export function fetchProductsReceived(products, pageNumber) {
    return {
        type: 'FETCH_PRODUCTS_RECEIVED',
        payload: {
            products,
            pageNumber
        }
    }
}

export function foundProductsReceived(products, pageNumber) {
    return {
        type: 'FOUND_PRODUCTS_RECEIVED',
        payload: {
            products,
            pageNumber
        }
    }
}

export function fetchProductsError() {
    return {
        type: 'FETCH_PRODUCTS_ERROR'
    }
}

//Featured

export function fetchFeatured(featured) {
    return (dispatch, getState) => {
        if(featured.length === 0) {
            dispatch(fetchFeaturedReceived([]));
            return;
        }

        const state = getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/products`, {
            categoryId: 0,
            ids: featured
        }, { headers })
            .then(res => dispatch(fetchFeaturedReceived(res.data)));
    }
}

export function fetchFeaturedReceived(featured) {
    return {
        type: 'FETCH_FEATURED_RECEIVED',
        payload: featured
    }
}

export function fetchProductReviewsReceived(reviews) {
    return {
        type: 'FETCH_PRODUCT_REVIEWS_RECEIVED',
        payload: reviews
    }
}