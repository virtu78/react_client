import axios from 'axios';

import { fetchOrderDetailsReceived, fetchFavoritesReceived } from '../../Actions/profile';
import { HOST } from '../../utils/constants'
import {getHeader} from "../../utils/common";

export default store => next => action => {
    if(action.type === 'FETCH_ORDER_DETAILS') {

        const state = store.getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/products`, {
            categoryId: [0],
            ids: action.payload.map(l => l.productId)
        }, { headers })
            .then(res => {
                store.dispatch(fetchOrderDetailsReceived(res.data));
            })

    } else if(action.type === 'FETCH_FAVORITES') {
        if(action.payload.length === 0) {
            store.dispatch(fetchFavoritesReceived([]));
            return;
        }

        const state = store.getState();
        const headers = getHeader(state.filial, state.settings.onlyCity);

        axios.post(`${HOST}/api/catalog/products`, {
            categoryId: [0],
            ids: action.payload
        }, { headers })
            .then(res => {
                store.dispatch(fetchFavoritesReceived(res.data));
            });

    } else
        return next(action);
}