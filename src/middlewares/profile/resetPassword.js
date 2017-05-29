import { HOST } from '../../utils/constants';
import * as Ons from 'onsenui';

export default store => next => action => {
	if(action.type !== 'RESET_PASSWORD')
    	return next(action);

    $.ajax({
        url: `${HOST}/api/customer/ResetPassword`,
        type: 'POST',
        data: {
        	EMail: action.payload
        },
        beforeSend: (req) => {
            //todo иедикатор
        },
        success: (data) => {
            Ons.notification.alert({
				message: 'Письмо с новым паролем отправлено Вам на почту',
				title: ''
			});
        },
        error: (xhr) => {
            Ons.notification.alert({
				message: JSON.parse( xhr.responseText ).message,
				title: ''
			});//todo похожим образом запилить в других местах
        }
    });
}