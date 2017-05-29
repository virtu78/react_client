import { addFavoriteSuccess } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
	if(action.type !== 'ADD_FAVORITE')
		return next(action);

    $.ajax({
        url: `${HOST}/api/customer/addFavorite`,
        type: 'POST',
        data: { productId: action.payload },
        beforeSend: (req) => {
            //todo loader
            req.setRequestHeader('AuthToken', store.getState().profile.authToken);
        },
        success: (data) => {
            store.dispatch(addFavoriteSuccess(action.payload));
        },
        error: (xhr) => {
            //todo
            throw xhr.statusText;
        }
    });
}