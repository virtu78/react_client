import { addAddressSuccess } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
	if(action.type !== 'ADD_ADDRESS')
		return next(action);

	$.ajax({
        url: `${HOST}/api/customer/AddAddress`,
        type: 'POST',
        data: action.payload,
        beforeSend: (req) => {
            //todo loader
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: (id) => {
        	const address = {
        		id,
        		...action.payload
        	};
            store.dispatch(addAddressSuccess(address));
        },
        error: (xhr) => {
            //todo
            throw xhr.statusText;
        }
    });
}