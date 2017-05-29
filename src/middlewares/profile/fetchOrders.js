import { fetchOrdersReceived } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
	if(action.type !== 'FETCH_ORDERS')
		return next(action);

	$.ajax({
        url: `${HOST}/api/customer/shoporders`,
        type: 'POST',
        beforeSend: (req) => {
            //todo loader
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: (data) => {
            store.dispatch(fetchOrdersReceived(data));
        },
        error: (xhr) => {
            //todo
            throw xhr.statusText;
        }
    });
}