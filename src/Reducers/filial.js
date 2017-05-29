import { getCityList } from '../utils/filial';

function getInitialState() {
    return {
        city: undefined,
        filialId: undefined,
        filials: []
    }
}

export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_CITY':
            localStorage.setItem('City', action.payload);
            return { ...state, city: action.payload, filialId: getFilialIdIfSingleInCity(state.filials, action.payload) };
        case 'SET_FILIAL':
            return { ...state, filialId: action.payload };
        case 'FETCH_FILIALS_RECEIVED':
            const cities = getCityList(action.payload);

            return { 
                ...state, 
                filials: action.payload,
                cities,
                city: getCityIfSingle(cities),
                filialId: getFilialIdIfSingle(action.payload)
            };
        case 'FETCH_CITIES_RECEIVED':
            return {
                ...state,
                cities: action.payload
            };
        default: return state;
    }
}

function getCityIfSingle(cities) {
    if(cities.length === 1)
        return cities[0].name;
}

function getFilialIdIfSingle(filials) {
    if(filials.length === 1)
        return filials[0].id;
}

function getFilialIdIfSingleInCity(filials, city) {
    const filialsInCity = filials.filter(f => f.city === city);
    if(filialsInCity.length === 1)
        return filialsInCity[0].id;
}