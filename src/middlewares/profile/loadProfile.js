import { setAuthToken, profileReceived, fetchOrders, clearProfile } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
    if(action.type !== 'LOAD_PROFILE')
        return next(action);

    $.ajax({
        url: `${HOST}/api/customer/profile`,
        type: 'POST',
        beforeSend: (req) => {
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: (data) => {
            store.dispatch(profileReceived(data));
            store.dispatch(fetchOrders());
        },
        error: (xhr) => {
            localStorage.removeItem('AuthToken');
            store.dispatch(setAuthToken(undefined));
            store.dispatch(clearProfile());
            throw xhr.statusText;
        }
    });
}