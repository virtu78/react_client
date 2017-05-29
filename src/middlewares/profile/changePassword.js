import { HOST } from '../../utils/constants';
import * as Ons from 'onsenui';

export default store => next => action => {
	if(action.type !== 'CHANGE_PASSWORD')
    	return next(action);

    const profile = store.getState().profile;

    $.ajax({
        url: `${HOST}/api/customer/ChangePassword`,
        type: 'POST',
        data: {
        	newPassword: action.payload
        },
        beforeSend: (req) => {
            req.setRequestHeader('AuthToken', profile.authToken);
        },
        success: (data) => {
            Ons.notification.alert({
				message: 'Пароль изменен',
				title: ''
			});
        },
        error: (xhr) => {
            Ons.notification.alert({
				message: JSON.parse( xhr.responseText ).message,
				title: ''
			});
        }
    });
}