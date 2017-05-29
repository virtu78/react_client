import { setAuthToken, clearProfile, changeAvatar } from '../../Actions/profile'
import { HOST } from '../../utils/constants'
import * as Ons from 'onsenui';

export default store => next => action => {
    if(action.type !== 'SEND_PROFILE')
        return next(action);

    const profile = store.getState().profile;

    $.ajax({
        url: `${HOST}/api/customer/editprofile`,
        type: 'POST',
        data: {
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            addresses: profile.addresses,
            favoritesIds: profile.favoritesIds,
            avatarImageId: profile.avatarImageId
        },
        beforeSend: (req) => {
            //todo
            req.setRequestHeader('AuthToken', profile.authToken);
        },
        success: (data) => {
            const file = document.getElementById('imgchooser').files[0];
            if(file === undefined) {
                saySuccess();
                return;
            }

            var fd = new FormData();
            fd.append('avatar', file, file.name);
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${HOST}/api/customer/uploadAvatar`);
            xhr.setRequestHeader('AuthToken', profile.authToken);
            xhr.onload = function() {
                document.getElementById('imgchooser').value = '';
                const result = JSON.parse(xhr.response.replace(/\\/g, '/'));
                const id = Object.keys(result)[0]
                store.dispatch(changeAvatar(id, result[id]));
                saySuccess();
            }
            xhr.send(fd);

        },
        error: (xhr) => {
            //todo
            localStorage.removeItem('AuthToken');
            store.dispatch(setAuthToken(undefined));
            store.dispatch(clearProfile());
            throw xhr.statusText;
        }
    });
}

function saySuccess() {
    Ons.notification.alert({
        message: "Профиль сохранен",
        title: ''
    });
}