export function setCity(city) {
    return {
        type: 'SET_CITY',
        payload: city
    }
}

export function setFilial(id) {
    return {
        type: 'SET_FILIAL',
        payload: id
    }
}

export function fetchFilialsReceived(filials) {
    return {
        type: 'FETCH_FILIALS_RECEIVED',
        payload: filials
    }
}

export function fetchCitiesReceived(cities) {
    return {
        type: 'FETCH_CITIES_RECEIVED',
        payload: cities
    }
}