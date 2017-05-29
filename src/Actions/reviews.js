import axios from 'axios';

import {fetchProductReviewsReceived} from "./catalog";

import { HOST } from '../utils/constants';
import {getHeader} from "../utils/common";

export function fetchReviews(productId) {
    return (dispatch, getState) => {
        const data = {};
        if(productId !== undefined)
            data.productId = productId;
        else
            data.placeId = getState().filial.filialId;

        const state = getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/reviews`, data, { headers })
			.then(res => {
                if(productId !== undefined)
                    dispatch(fetchProductReviewsReceived(res.data));
                else
                    dispatch(fetchReviewsReceived(res.data));
			});
    }
}

function fetchReviewsReceived(reviews) {
	return {
		type: 'FETCH_REVIEWS_RECEIVED',
		payload: reviews
	}
}

export function sendReview(displayName, displayEMail, title, description, rate, productId) {
    return (dispatch, getState) => {
        const state = getState();

        const data = {
            displayName,
            displayEMail,
            title,
            description,
            rate
        };

        if(productId === undefined)
            data.placeId = state.filial.filialId;
        else
            data.productId = productId;

        const headers = getHeader(state.filial, state.settings.onlyCity);

        if(state.profile.authToken !== undefined)
            headers['AuthToken'] = state.profile.authToken;

        axios.post(`${HOST}/api/catalog/AddReview`, data, { headers });
    };
}