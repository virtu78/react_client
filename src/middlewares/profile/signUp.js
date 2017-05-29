import { setAuthMessage, signIn } from '../../Actions/profile'
import { HOST } from '../../utils/constants'

export default store => next => action => {
    if(action.type !== 'SIGN_UP')
        return next(action);

    $.ajax({
        url: `${HOST}/api/customer/register`,
        type: 'POST',
        data: action.payload,
        beforeSend: (req) => {
            //todo
        },
        success: (data) => {
            store.dispatch(setAuthMessage('Успешно'))
            store.dispatch(signIn(action.payload.email, action.payload.password));
        },
        error: (xhr, error, status) => {
            if(xhr.status === 409)
                store.dispatch(setAuthMessage(JSON.parse(xhr.responseText).message))
            else
                throw xhr.statusText;
        }
    });
}