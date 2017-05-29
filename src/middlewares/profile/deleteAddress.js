import { deleteAddressSuccess } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
	if(action.type !== 'DELETE_ADDRESS')
		return next(action);

	$.ajax({
        url: `${HOST}/api/customer/RemoveAddress`,
        type: 'POST',
        data: { id: action.payload },
        beforeSend: (req) => {
            //todo loader
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: () => {
            store.dispatch(deleteAddressSuccess(action.payload));
        },
        error: (xhr) => {
            //todo
            throw xhr.statusText;
        }
    });
}