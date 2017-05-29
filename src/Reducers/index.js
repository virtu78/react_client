import { combineReducers } from 'redux';
import filial from './filial';
import catalog from './catalog';
import profile from './profile';
import cart from './cart';
import order from './order';
import reviews from './reviews';
import settings from './settings';

import CatalogPage from '../Containers/catalogPage';

export default combineReducers({
    filial,
    catalog,
	profile,
	cart,
	order,
	reviews,
	settings,
	isFirstRun: function(state = true, action) {
    	if(action.type === 'SET_FIRST_RUN_FLAG')
    		return action.payload;
    	return state;
	},
	loaded: function(state = false, action) {
        if(action.type === 'COMPLETE_LOADING')
        	return !state;
        return state
	},
	sideMenu: function (state = { isOpen: false, showCatalog: false }, action) {
		if(action.type === 'OPEN_SIDE_MENU')
			return { ...state, isOpen: true, showCatalog: action.payload };
		else if(action.type === 'CLOSE_SIDE_MENU')
                return { ...state, isOpen: false, showCatalog: false };
		return state;
    }
});