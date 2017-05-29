import { removeFavoriteSuccess } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
	if(action.type !== 'REMOVE_FAVORITE')
		return next(action);

	$.ajax({
        url: `${HOST}/api/customer/removeFavorite`,
        type: 'POST',
        data: { productId: action.payload },
        beforeSend: (req) => {
            //todo loader
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: (data) => {
            store.dispatch(removeFavoriteSuccess(action.payload));
        },
        error: (xhr) => {
            //todo
            throw xhr.statusText;
        }
    });
}