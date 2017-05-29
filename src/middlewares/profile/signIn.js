import { setAuthMessage, setAuthToken, loadProfile } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
    if(action.type !== 'SIGN_IN')
        return next(action);

    $.ajax({
        url: `${HOST}/api/customer/auth`,
        type: 'POST',
        data: action.payload,
        beforeSend: (req) => {
            //todo
        },
        success: (data) => {
            localStorage.setItem('AuthToken', data);
            store.dispatch(setAuthToken(data));
            store.dispatch(loadProfile());
        },
        error: (xhr) => {
        	if(xhr.status === 401)
        		store.dispatch(setAuthMessage(JSON.parse(xhr.responseText).message))
            else
            	throw xhr.statusText;
        }
    });
}