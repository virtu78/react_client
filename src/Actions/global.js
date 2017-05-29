import axios from 'axios';

import { HOST } from '../utils/constants';

import { fetchFilialsReceived, fetchCitiesReceived } from './filial';
import { fetchSettingsReceived } from './settings';
import { fetchAdditionalFieldsReceived } from './order';
import { setAuthToken, loadProfile } from './profile';

export function load() {
    return dispatch => {
        axios.get(`${HOST}/api/settings`)
            .then(res => {
                dispatch(fetchSettingsReceived(res.data));

                axios.get(`${HOST}/api/places`)
                    .then(res => {
                        setTimeout(() => {
                            dispatch(fetchFilialsReceived(res.data));
                            dispatch(setFirstRunFlag( localStorage.getItem('FirstRunFlag') === null ));
                            dispatch({ type: 'COMPLETE_LOADING' });
                        }, 2000);
                    });

                if(res.data.noOrderMode === false)
                    axios.get(`${HOST}/api/shoporder/GetFields`)
                        .then(res => {
                            res.data.sort((a, b) => a.sortOrder - b.sortOrder);
                            dispatch(fetchAdditionalFieldsReceived(res.data));
                        });

                const token = localStorage.getItem('AuthToken');
                if(token) {
                    dispatch(setAuthToken(token));
                    dispatch(loadProfile());
                }
            });
    }
}

export function setFirstRunFlag(flag) {
    return {
        type: 'SET_FIRST_RUN_FLAG',
        payload: flag
    }
}